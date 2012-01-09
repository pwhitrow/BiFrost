<?php
/*
    Document   : _bf_reviews.php
    Created on : 14-Nov-2011, 20:12:22
    Author     : Paul Whitrow
    Description: Visitor Review - get and post reviews
*/

function postReview()
{
    if(permitted())
    {
        $prep = array();

        foreach ($_POST as $k => $v)
        {
            $prep[$k] = prepForDB($v);
        }
        
        // sort out the tags!
        $tmp = explode(',', trim($prep['tagsid'], ','));
        $tags = '[';
        if(count($tmp) > 1)
        {
            foreach($tmp as $t)
            {
                $tags .= $t . '][';
            }
        }
        else
        {
            $tags .= $tmp[0];
        }
        $tags .= ']';

        // store review
        $sql1 = "INSERT INTO reviews (parent_id, api_key, user_id, title, content, posted, tags) VALUES('".$prep['parentid']."', '".$prep['api_key']."', '".$_SESSION['user']['id']."', '".$prep['title']."', '".$prep['content']."', NOW(), '".$tags."')";
        
        if(mysql_query($sql1))
        {
            $linkedID = mysql_insert_id();
            
            // store rating
            $sql2 = "INSERT INTO ratings (parent_id, rating, user_id, linked_id) VALUES('".$prep['parentid']."', '".$prep['score']."', '".$_SESSION['user']['id']."', '".$linkedID."')";
            
            mysql_query($sql2);
        
            // store media?
            if($prep['media'] != '')
            {        
                // create thumbs for images
                $images = explode(',', $prep['media']);
                foreach($images as $img)
                {
                    $source = '../'.MEDIA_LOCATION.'/'.$img;
                    $ext = _getFileExtension($img);
                    
                    //.jpeg;*.jpg;*.gif;*.png;*.mov;*.avi;*.mpg;*.mpeg;*.flv;
                    
                    if(in_array($ext, array('jpeg', 'jpg', 'gif', 'png')))
                    {
                        $thumb = str_replace('.'.$ext, '_thumb.'.$ext, $source);
                        _imageResize($source, $thumb, 100, 100);
                    }
                    
                }

                $sql3 = "INSERT INTO media (parent_id, parent_type, media, user_id, linked_id) VALUES('".$prep['parentid']."', 'review', '".$prep['media']."', '".$_SESSION['user']['id']."', '".$linkedID."')";
            }
            
            mysql_query($sql3);
            
            setSuccessMsg(t('Thank you for posting your review'));
        }
        else
        {
            setErrorMsg(mysql_error(), 'reviewpost');
            return false;
        }
    }
    else
    {
        setErrorMsg(t('Failed to post review, not logged in'));
        return false;
    }


}

function getUserReviews()
{
    $sql = "SELECT *, DATE_FORMAT(posted,'%b %d %Y, %h:%i %p') AS fdate FROM reviews WHERE user_id = '".$_SESSION['user']['id']."' AND api_key = '".$_POST['api_key']."' ORDER BY id DESC";

    $sql = mysql_query($sql);

    $rows = array();

    while($r = mysql_fetch_assoc($sql))
    {
        $rows[] = $r;
    }

    setResponse('userreviews', json_encode($rows));
}

function mediaExists($media)
{
    $tmp = explode(',', $media);
    $str = '';

    foreach($tmp as $m)
    {
        $tmp = '../' . $_POST['uploads'] . '/'.$m;
        
        if(file_exists($tmp))
        {
            $str .= $m.',';
        }
        else
        {
            $str .= $_POST['noimage'].',';
        }
    }
    
    return rtrim($str, ',');
}

function getItemReviewsByTag()
{
    $tag = str_replace('tag_', '', $_POST['tag']);
    
    $sql = "SELECT *, DATE_FORMAT(posted,'%b %d %Y, %h:%i %p') AS fdate FROM reviews WHERE parent_id = '".$_POST['parentid']."' AND api_key = '".$_POST['api_key']."' AND tags LIKE '%[".$tag."]%' ORDER BY id DESC LIMIT ".$_POST['limitfrom'].", ".$_POST['limit']."";

    $sqlQty = mysql_fetch_array(mysql_query("SELECT COUNT(id) AS qty FROM reviews WHERE parent_id = '".$_POST['parentid']."' AND api_key = '".$_POST['api_key']."' AND tags LIKE '%[".$tag."]%'"));

    processSQL($sql, $sqlQty);       
}

function getItemReviews()
{
    $sql = "SELECT *, DATE_FORMAT(posted,'%b %d %Y, %h:%i %p') AS fdate FROM reviews WHERE parent_id = '".$_POST['parentid']."' AND api_key = '".$_POST['api_key']."' ORDER BY id DESC LIMIT ".$_POST['limitfrom'].", ".$_POST['limit']."";
    
    $sqlQty = mysql_fetch_array(mysql_query("SELECT COUNT(id) AS qty FROM reviews WHERE parent_id = '".$_POST['parentid']."' AND api_key = '".$_POST['api_key']."'"));

    processSQL($sql, $sqlQty);   
}

function processSQL($sql, $sqlQty)
{
    
    $sql = mysql_query($sql);

    $rows = array();
    
    $rows['recordqty'] = $sqlQty['qty'];

    while($r = mysql_fetch_array($sql))
    {
        // fetch user data
        $user = mysql_query("SELECT * FROM users WHERE user_id = '".$r['user_id']."'");
        
        if(mysql_num_rows($user) > 0)
        {
            $user = mysql_fetch_array($user);
            $rows['gname'][] = $user['gname'];           
            $rows['fname'][] = $user['fname'];

            $rows['avatar'][] = checkAvatar($user['avatar']);
        }

        // fetch ratings data
        $ratings = mysql_query("SELECT * FROM ratings WHERE parent_id = '".$r['parent_id']."' AND linked_id = '".$r['id']."'");
        
        if(mysql_num_rows($ratings) > 0)
        {
            $ratings = mysql_fetch_array($ratings);
            $rows['rated'][] = $ratings['rating'];           
        }
        else
        {
            $rows['rated'][] = 0;
        }

        // fetch media data
        $media = mysql_query("SELECT * FROM media WHERE parent_id = '".$r['parent_id']."' AND linked_id = '".$r['id']."'");
        
        if(mysql_num_rows($media) > 0)
        {
            $media = mysql_fetch_array($media);
            $rows['media'][] = mediaExists($media['media']);           
        }
        else
        {
            $rows['media'][] = false;
        }
        
        // add review to response
        $rows['id'][] = $r['id'];
        $rows['title'][] = $r['title'];
        $rows['content'][] = nl2br($r['content']);
        $rows['fdate'][] = $r['fdate'];
        $rows['isodate'][] = date('c', strtotime($r['posted']));
        
        // fetch tag data
        $tags = explode(']', str_replace('[', '', $r['tags']));
        $tagdata = mysql_query("SELECT * FROM tags WHERE api_key = '".$_POST['api_key']."'");
        $tmp = array();
        
        while($row = mysql_fetch_array($tagdata))
        {
            foreach($tags as $t)
            {
                if($row['id'] == $t)
                {
                    $tmp[] = $row['tagname'];
                }
            }
        }
                        
        $rows['tags'][] = trim(str_replace('[', '', str_replace(']', ',', $r['tags'])), ',');
        $rows['tagnames'][] = implode(',', $tmp);
    }

    setResponse('itemreviews', json_encode($rows));
    
    getItemRating($_POST['parentid']);    
}

function getItemRating($id)
{
    $sql = "SELECT SUM(rating) AS total_rating, COUNT(rating) AS num_ratings, FLOOR(SUM(rating)/COUNT(rating)) AS avg_rating FROM ratings WHERE parent_id = '".$id."'";
    
    $sql = mysql_query($sql);
    
    $avg = mysql_fetch_array($sql);
    
    setResponse('itemrating', json_encode($avg));
}

?>