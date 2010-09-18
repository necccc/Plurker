<?php

$nick_name = 'johndoe';
$password = 'secret!';

require 'RLPlurkAPI.php';

$plurk = new RLPlurkAPI();
$plurk->login($nick_name, $password);

// these are my friends/fans
print_r($plurk->friends);


//echo "\n\n------ getAlerts ------\n";
//echo "These are the friend requests you have:\n";
//$alerts = $plurk->getAlerts();
//print_r($alerts);

// these are my blocked users
//print_r($plurk->getBlockedUsers());

// Uncomment to accept all friend requests from the alert queue.
//$plurk->befriend($alerts, true);
// ... or make them fans instead.
//$plurk->denyFriendMakeFan($alerts);

// block users x, y (x, and y are the user ids, which are integers).
//$plurk->blockUser(array(x, y));

// unblock users x, y (x, and y are the user ids, which are integers).
//$plurk->unblockUser(array(x, y));


/*
 * Get my plurks.
 */
//echo "\n\n------ getUnreadPlurks ------\n";
//print_r($plurk->getUnreadPlurks(true));

//echo "\n\n------ getPlurks ------\n";
//print_r($plurk->getPlurks($plurk->uid));

// get plurks with responses from a certain time.
//print_r($plurk->getPlurks($plurk->uid, '2008-02-01T01:10:00', '2008-02-01T01:00:00'));


//echo "\n\n------ addPlurk ------\n";
//$plurk->addPlurk('en', 'is', 'tired (:');

// mute a plurk
// $plurk->mutePlurk(RLPlurkAPI::permalinkToPlurkID('http://www.plurk.com/p/ajd4'), true);

// unmute a plurk
// $plurk->mutePlurk(RLPlurkAPI::permalinkToPlurkID('http://www.plurk.com/p/ajd4'), false);

//echo "\n\n------ deletePlurk ------\n";
//$plurk->deletePlurk(RLPlurkAPI::permalinkToPlurkID('http://www.plurk.com/p/o1k2'));

//echo "\n\n------ respondToPlurk ------\n";
//echo $plurk->respondToPlurk(RLPlurkAPI::permalinkToPlurkID('http://www.plurk.com/p/ajd4'), 'en', 'says', 'test from RLPlurkAPI');


//echo "\n\n------ getResponses ------\n";
//print_r($plurk->getResponses(491656));
//print_r($plurk->getResponses(RLPlurkAPI::permalinkToPlurkID('http://www.plurk.com/p/ajd4'))); // same thing


//$response = $plurk->respondToPlurk(RLPlurkAPI::permalinkToPlurkID("http://www.plurk.com/p/ajd4"), 'en', 'says', 'reply test from RLPlurkAPI');
//var_dump($response);


//$permalink = "http://www.plurk.com/p/ajd4";
//echo "Plurk id of $permalink: " . RLPlurkAPI::permalinkToPlurkID($permalink) . "\n\n";

//echo "\n\n------ uidToUserinfo ------\n";
// print_r($plurk->uidToUserinfo(58));
// print_r($plurk->uidToUserinfo(77777777));

//echo "\n\n------ nicknameToUid ------\n";
//echo $plurk->nicknameToUid('ryanlim');
//echo $plurk->nicknameToUid('ryanlimryanlimryanlim');
?>
