<?php
/*
    Document   : _bf_discussions.php
    Created on : 16-Nov-2011, 01:06:32
    Author     : Paul Whitrow
    Description: Get and post discussions
*/

function postDiscussion()
{
    if(permitted())
    {
        $prep = array();

        foreach ($_POST as $k => $v)
        {
            $prep[$k] = prepForDB($v);
        }
        
        // store discussion
        $sql1 = "INSERT INTO discussions (parent_id, api_key, user_id, content, posted) VALUES('".$prep['parentid']."', '".$prep['api_key']."', '".$_SESSION['user']['id']."', '".$prep['content']."', NOW())";
        
        if(mysql_query($sql1))
        {
            setSuccessMsg(t('Thank you for posting your discussion'));
        }
        else
        {
            setErrorMsg(mysql_error(), 'dicussionpost');
            return false;
        }
    }
    else
    {
        setErrorMsg(t('Failed to post discussion, not logged in'));
        return false;
    }


}

function getUserDiscussions()
{
    $sql = "SELECT *, DATE_FORMAT(posted,'%b %d %Y, %h:%i %p') AS fdate FROM discussions WHERE user_id = '".$_SESSION['user']['id']."' AND api_key = '".$_POST['api_key']."' ORDER BY id DESC";

    $sql = mysql_query($sql);

    $rows = array();
    
    while($r = mysql_fetch_assoc($sql))
    {
        $rows[] = $r;
    }

    setResponse('userdiscussions', json_encode($rows));
}

function getItemDiscussions()
{
    $sqlQty = mysql_fetch_array(mysql_query("SELECT COUNT(id) AS qty FROM discussions WHERE parent_id = '".$_POST['parentid']."' AND api_key = '".$_POST['api_key']."'"));
    
    $sql = "SELECT *, DATE_FORMAT(posted,'%b %d %Y, %h:%i %p') AS fdate FROM discussions WHERE parent_id = '".$_POST['parentid']."' AND api_key = '".$_POST['api_key']."' ORDER BY id DESC LIMIT ".$_POST['limitfrom'].", ".$_POST['limit']."";
        
    $sql = mysql_query($sql);

    $rows = array();
    $comments = array();

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

        $sqlComments = "SELECT *, DATE_FORMAT(posted,'%b %d %Y, %h:%i %p') AS fdate FROM comments WHERE parent_id = '".$r['id']."'";

        // fetch comments for item
        $q = mysql_query($sqlComments);

        if(mysql_num_rows($q) > 0)
        {
            while($c = mysql_fetch_array($q))
            {
                $comments['id'][] = $c['id'];
                $comments['parentid'][] = $c['parent_id'];
                $comments['user'][] = $c['user_id'];
                $comments['content'][] = nl2br($c['content']);
                $comments['fdate'][] = $c['fdate'];
                $comments['isodate'][] = date('c', strtotime($c['posted']));

                // fetch user data for comment
                $user = mysql_query("SELECT * FROM users WHERE user_id = '".$c['user_id']."'");

                if(mysql_num_rows($user) > 0)
                {
                    $user = mysql_fetch_array($user);
                    $comments['gname'][] = $user['gname'];
                    $comments['fname'][] = $user['fname'];
                    
                    $comments['avatar'][] = checkAvatar($user['avatar']);
                }
            }
        }

        $rows['id'][] = $r['id'];
        $rows['content'][] = nl2br($r['content']);
        $rows['fdate'][] = $r['fdate'];
        $rows['isodate'][] = date('c', strtotime($r['posted']));
    }

    setResponse('itemdiscussions', json_encode($rows));
    setResponse('itemcomments', json_encode($comments));
}

?>