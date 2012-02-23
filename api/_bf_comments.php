<?php
/*
    Document   : _bf_comments.php
    Created on : 16-Nov-2011, 01:06:32
    Author     : Paul Whitrow
    Description: get and post comments
*/

function postComment()
{
    if(permitted())
    {
        $prep = array();

        foreach ($_POST as $k => $v)
        {
            $prep[$k] = prepForDB($v);
        }
        
        // store comment
        $sql1 = "INSERT INTO ".TABLEPRENAME."comments (parent_id, api_key, user_id, content, posted) VALUES('".$prep['parentid']."', '".$prep['api_key']."', '".$_SESSION['user']['id']."', '".$prep['content']."', NOW())";
        
        if(mysql_query($sql1))
        {
            setSuccessMsg(t('Thank you for posting your comment'));
        }
        else
        {
            setErrorMsg(mysql_error(), 'commentpost');
            return false;
        }
    }
    else
    {
        setErrorMsg(t('Failed to post comment, not logged in'));
        return false;
    }


}

function getUserComments()
{
    global $result;

    $sql = "SELECT *, DATE_FORMAT(posted,'%b %d %Y, %h:%i %p') AS fdate FROM ".TABLEPRENAME."comments WHERE user_id = '".$_SESSION['user']['id']."' AND api_key = '".$_POST['api_key']."' ORDER BY id DESC";

    $sql = mysql_query($sql);

    $rows = array();
    
    while($r = mysql_fetch_assoc($sql))
    {
        $rows[] = $r;
    }

    setResponse('usercomments', json_encode($rows));
}

function getItemComments()
{
    $sql = "SELECT *, DATE_FORMAT(posted,'%b %d %Y, %h:%i %p') AS fdate FROM ".TABLEPRENAME."comments WHERE parent_id = '".$_POST['parentid']."' AND api_key = '".$_POST['api_key']."' ORDER BY id DESC";

    $sql = mysql_query($sql);

    $rows = array();

    while($r = mysql_fetch_array($sql))
    {
        // fetch user data
        $user = mysql_query("SELECT * FROM ".TABLEPRENAME."users WHERE user_id = '".$r['user_id']."'");

        if(mysql_num_rows($user) > 0)
        {
            $user = mysql_fetch_array($user);
            $rows['gname'][] = $user['gname'];
            $rows['fname'][] = $user['fname'];
            $rows['avatar'][] = $user['avatar'];
        }

        $rows['id'][] = $r['id'];
        $rows['content'][] = nl2br(makeLinks($r['content']));
        $rows['fdate'][] = $r['fdate'];
    }

    setResponse('itemcomments', json_encode($rows));
}

?>