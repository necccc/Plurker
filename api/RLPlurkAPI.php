<?php
/**
 * This is an unofficial PHP Plurk API provided by Ryan Lim.
 *
 * PHP version 5
 *
 * LICENSE: Redistribution and use in source and binary forms, with or
 * without modification, are permitted provided that the following
 * conditions are met: Redistributions of source code must retain the
 * above copyright notice, this list of conditions and the following
 * disclaimer. Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 * NO EVENT SHALL CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
 * OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
 * USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 * 
 * @category  API 
 * @package   RLPlurkAPI
 * @author    Ryan Lim <plurk-api@ryanlim.com>
 * @copyright 2008 Ryan Lim
 * @license   http://www.opensource.org/licenses/bsd-license.php BSD License
 * @link      http://plurk.ryanlim.com/
 */

/**
 * RLPlurkAPI version.
 */
define('RLPLURKAPI_VERSION', '0.4.2');

/**
 * Set our include_path to include our own pear location path.
 */
set_include_path('./pear' . PATH_SEPARATOR . get_include_path() . 
    PATH_SEPARATOR . '.');

/**
 * Dependencies on Services_JSON, HTTP_Client
 */
require_once 'Services/JSON.php';
require_once 'HTTP/Client.php';
require_once 'HTTP/Client/CookieManager.php';


/**
 * JSON decoder that we use. The pecl/json function doesn't work too well
 * for what we need.
 *
 * @param string $content The content to be decoded.
 * @param bool   $assoc   Return an associative array if this is true, otherwise a 
 *                        Services_JSON object.
 *
 * @return mixed The results, either in Services_JSON object form or an 
 * associative array.
 */
function Services_Json_Json_decode($content, $assoc=false)
{
    if ($assoc) {
        $json = new Services_JSON(SERVICES_JSON_LOOSE_TYPE);
    } else {
        $json = new Services_JSON;
    }
    return $json->decode($content);
}


/*
******************************************************************************
 
This is an unofficial Plurk API code, and thus, is not supported by the Plurk
team. Please do not contact them if you encounter problems with this API.

Instead, please browse the bug report at:
   http://code.google.com/p/rlplurkapi/issues/list
and see if the bug has already been reported. If it has not been reported,
please report it.

******************************************************************************
*/

/**
 * This is an unofficial PHP Plurk API provided by Ryan Lim.
 *
 * PHP version 5
 * 
 * @category  API 
 * @package   RLPlurkAPI
 * @author    Ryan Lim <plurk-api@ryanlim.com>
 * @copyright 2008 Ryan Lim
 * @version   0.4.2
 * @license   http://www.opensource.org/licenses/bsd-license.php BSD License
 * @link      http://plurk.ryanlim.com/
 */
class RLPlurkAPI
{

    /**
     * The http options that we provide to the http methods.
     * @var array $http_options
     */
    protected $http_options = array();

    /**
     * The http client object used to make http requests
     * @var array $http_client
     */
    protected $http_client = null;

    /**
     * The plurk URL paths that we can use.
     * @var array $plurk_paths
     */
    protected $plurk_paths = array(
        'http_base'             => 'http://www.plurk.com',
        'login'                 => 
                        'http://www.plurk.com/Users/login?redirect_page=main',
        'getCompletion'         => 'http://www.plurk.com/Users/getCompletion',
        'plurk_add'             => 'http://www.plurk.com/TimeLine/addPlurk',
        'plurk_respond'         => 'http://www.plurk.com/Responses/add',
        'plurk_get'             => 'http://www.plurk.com/TimeLine/getPlurks',
        'plurk_get_responses'   => 'http://www.plurk.com/Responses/get2',
        'plurk_get_unread'      => 'http://www.plurk.com/TimeLine/getUnreadPlurks',
        'plurk_mute'            => 'http://www.plurk.com/TimeLine/setMutePlurk',
        'plurk_delete'          => 'http://www.plurk.com/TimeLine/deletePlurk',
        'notification'          => 'http://www.plurk.com/Notifications',
        'notification_accept'   => 'http://www.plurk.com/Notifications/allow',
        'notification_makefan'  => 
                        'http://www.plurk.com/Notifications/allowDontFollow',
        'notification_deny'     => 'http://www.plurk.com/Notifications/deny',
        'friends_get'           => 'http://www.plurk.com/Users/friends_get',
        'friends_block'         => 'http://www.plurk.com/Friends/blockUser',
        'friends_remove_block'  => 'http://www.plurk.com/Friends/removeBlock',
        'friends_get_blocked'   => 'http://www.plurk.com/Friends/getBlockedByOffset',
        'user_get_info'         => 'http://www.plurk.com/Users/fetchUserInfo',
        );

    /**
     * Are we logged in?
     * @var bool $bool_login
     */
    protected $bool_login = false;

    /**
     * Our Plurk uid.
     * @var int $uid
     */
    public $uid = -1;

    /**
     * Our Plurk nick name.
     * @var string $nick_name
     */
    public $nick_name = '';

    /**
     * The associative array of friend uids => nick_names
     * @var array $friends
     */
    public $friends = array();

    /**
     * Constructor.
     */
    function __construct()
    {
        $this->bool_login = false;

        $this->http_options = array(
            'User-Agent' => 'RLPlurkAPI ' . RLPLURKAPI_VERSION,
        );

        $this->http_client = new HTTP_Client();
        $this->http_client->setDefaultHeader($this->http_options);
    }


    /**
     * Login to Plurk.
     *
     * @param string $nick_name The nickname of the user to login as.
     * @param string $password  The password for this user.
     *
     * @return bool true if login was successful, false otherwise.
     */
    function login($nick_name, $password)
    {
        $array_query = array(
            'nick_name' => $nick_name,
            'password'  => $password
            );

        $this->http_client->post($this->plurk_paths['login'],
            $array_query);

        $array_response = $this->http_client->currentResponse();

        $this->bool_login = false;

        foreach ($this->http_client->_cookieManager->_cookies as $cookie) {
            if (isset($cookie['name']) && $cookie['name'] == 'plurkcookie') {
                $this->bool_login = true;

                break;
            }
        }

        if ($this->bool_login == true) {
            /*
             * Get my user information.
             */
            $this->http_client->get("http://www.plurk.com/user/{$nick_name}");

            $array_profile = $this->http_client->currentResponse();
            preg_match('/var GLOBAL = \{.*"uid": ([\d]+),.*\}/imU',
                $array_profile['body'], $matches);
            $this->uid       = $matches[1];
            $this->nick_name = $nick_name;

            /*
             * Get my friends' information.
             */
            $this->http_client->get($this->plurk_paths['getCompletion'],
                array('user_id' => $this->uid));

            $array_result = $this->http_client->currentResponse();

            $this->friends = array();

            $array_tmp = RLPlurkAPI::dejsonize($array_result['body']);
            if (isset($array_tmp[0])) {
                foreach ($array_tmp[0] as $key => $value) {
                    $value['uid'] = $key;

                    $this->friends[$key] = $value;
                }
            }

        }
        return $this->bool_login;
    }


    /**
     * Are we logged in?
     *
     * @return bool true if we are logged in, false otherwise.
     */
    function isLoggedIn()
    {
        return $this->bool_login;
    }

    /**
     * Parse the Plurk JSON string into an array.
     *
     * @param string $data The array of json data (must be surrounded by '[' 
     * and ']').
     *
     * @return array The array (numeric) array of plurks (an associative 
     * subarray).
     */
    public static function dejsonize($data)
    {
        $data = substr($data, 1, strlen($data));
        $data = substr($data, 0, strlen($data)-1);
        if (strlen($data) == 0) {
            return array();
        }

        $array_data = array();

        $array_json = explode("}, {", $data);
        
        foreach ($array_json as &$item) {
            if (substr($item, 0, 1) != '{') {
                $item = '{' . $item;
            }

            if (substr($item, strlen($item)-1, strlen($item)) != '}') {
                $item = $item . '}';
            }

            $item = preg_replace("/karma': ([\d\.]+),/", "karma': '$1',", $item);
            $item = preg_replace('/new Date\((.*)\)/', "$1", $item);
            $item = preg_replace("/: u'/", ": '", $item);
            $item = preg_replace("/: u\"/", ": \"", $item);
            $item = preg_replace("/L, '/", ", '", $item);
            $item = preg_replace("/datetime\.date\((\d+), (\d+), (\d+)\), '/", 
                "'$1-$2-$3', '", $item);
            $item = preg_replace("/None, '/", "'', '", $item);
            $item = preg_replace("/True, '/", "1, '", $item);
            $item = preg_replace("/False, '/", "0, '", $item);
            $item = preg_replace("/\t/", "'", $item);

            $pattern    = array();
            $pattern[0] = "/\{'/";
            $pattern[1] = "/':/";
            $pattern[2] = "/, '/";
            $pattern[3] = "/: '/";
            $pattern[4] = "/',/";
            $pattern[5] = "/'\}/";

            $replacement    = array();
            $replacement[0] = "{\"";
            $replacement[1] = "\":";
            $replacement[2] = ", \"";
            $replacement[3] = ": \"";
            $replacement[4] = "\",";
            $replacement[5] = "\"}";

            $item = preg_replace($pattern, $replacement, $item);



            $dejsonized = Services_Json_Json_decode($item, true);
            if ($dejsonized == false) {
                echo "Error decoding: [$item]\n";
            } else {
                $array_data[] = $dejsonized;
            }
        }

        return $array_data;
    }

    /**
     * Add a new plurk.
     *
     * @param string $string_lang      The plurk language.
     * @param string $string_qualifier The plurk qualifier.
     * @param string $string_content   The content of the plurk to be posted.
     * @param bool   $allow_comments   true if this plurk allows comments, false 
     *                                 otherwise.
     * @param array  $array_limited_to The array of uids this plurk is visible 
     *                                 to. If this array is of size 0, it is 
     *                                 visible to everyone.
     *
     * @return bool true if it was posted, false otherwise.
     */
    function addPlurk(
        $string_lang = 'en',
        $string_qualifier = 'says',
        $string_content = '',
        $allow_comments = true,
        $array_limited_to = array()
    )
    {
        if ($this->bool_login == false) {
            return false;
        }

        if (!is_string($string_lang) ||
            !is_string($string_qualifier) ||
            !is_string($string_content) ||
            $string_content == '' ||
            ! is_array($array_limited_to) ||
            ! is_bool($allow_comments)
        ) {
            return false;
        }

        $posted_ = gmdate('c');
        $posted_ = explode('+', $posted_);
        $posted  = urlencode($posted_[0]);

        $qualifier = urlencode(':');
        if ($string_qualifier != '') {
            $qualifier = urlencode($string_qualifier);
        }

        if (strlen($string_content) > 140) {
            return false;
        }
        $content = urlencode($string_content);

        $no_comments = '1';
        if ($allow_comments == true) {
            $no_comments = '0';
        }

        $lang = urlencode($string_lang);

        $array_query = array(
            'posted'      => $posted,
            'qualifier'   => $qualifier,
            'content'     => $content,
            'lang'        => $lang,
            'uid'         => $this->uid,
            'no_comments' => $no_comments
            );

        if (count($array_limited_to) > 0) {
            $limited_to = '[' . implode(',', $array_limited_to) . ']';
            $limited_to = urlencode($limited_to);

            $array_query['limited_to'] = $limited_to;
        }

        $this->http_client->get($this->plurk_paths['plurk_add'], 
            $array_query, true);

        $array_response = $this->http_client->currentResponse();

        if (preg_match('/anti-flood/', $array_response['body']) != 0) {
            return false;
        }

        if (preg_match('/"error":\s(\S+)}/', $array_response['body'], 
            $error_match) != 0) {
            if ($error_match[1] != 'null') {
                echo "Error sending message: ";
                echo print_r($error_match[1], true) . "\n";
                return false;
            }
        }


        return true;
    }

    /**
     * Get alert notification for friend requests.
     *
     * @return mixed false on error(s), otherwise an array
     * of friend uids.
     */
    function getAlerts()
    {
        if ($this->bool_login == false) {
            return false;
        }

        $this->http_client->get($this->plurk_paths['notification']);
        $array_notification_page = $this->http_client->currentResponse();

        preg_match_all('/DI\s*\(\s*Notifications\.render\(\s*(\d+),\s*0\)\s*\);/iU',
            $array_notification_page['body'],
            $requests);

        if (isset($requests[1])) {
            return $requests[1];
        } else {
            return array();
        }
    }

    /**
     * Befriend or decline a friend request.
     *
     * @param array $array_uid     The array of friend uids.
     * @param bool  $bool_befriend If true, accept friend requests, decline 
     *                             otherwise.
     *
     * @return bool Returns true if successful or false otherwise.
     */
    function befriend($array_uid, $bool_befriend)
    {
        if ($this->bool_login == false) {
            return false;
        }

        if (!is_array($array_uid) || !is_bool($bool_befriend)) {
            return false;
        }

        $string_path_accept_deny = $this->plurk_paths['notification_accept'];
        if ($bool_befriend == false) {
            $string_path_accept_deny = $this->plurk_paths['notification_deny'];
        }

        foreach ($array_uid as $friend_id) {
            $this->http_client->post($string_path_accept_deny,
                array('friend_id' => $friend_id));
            $response = $this->http_client->currentResponse();


            if ($bool_befriend == false) {
                echo "Denied request from id $friend_id\n";
            } else {
                echo "Accepted request from id $friend_id\n";
            }
        }

        return true;
    }

    /**
     * Decline a friend request but make as friend instead.
     *
     * @param array $array_uid The array of friend requests uids.
     *
     * @return bool Returns true if successful or false otherwise.
     */
    function denyFriendMakeFan($array_uid)
    {
        if ($this->bool_login == false) {
            return false;
        }

        if (!is_array($array_uid)) {
            return false;
        }

        foreach ($array_uid as $friend_id) {
            $this->http_client->post($this->plurk_paths['notification_makefan'],
                array('friend_id' => $friend_id));
            $response = $this->http_client->currentResponse();

            echo "Denied request from id $friend_id, but added as fan.\n";
        }

        return true;
    }

    /**
     * Block users.
     *
     * @param array $array_uid The array of user ids to be blocked.
     *
     * @return bool Returns true if successful or false otherwise.
     */
    function blockUser($array_uid)
    {
        if ($this->bool_login == false) {
            return false;
        }

        if (!is_array($array_uid)) {
            return false;
        }

        foreach ($array_uid as $friend_id) {
            $this->http_client->post($this->plurk_paths['friends_block'],
                array('block_uid' => $friend_id));
            $response = $this->http_client->currentResponse();

            echo "Blocked friend id $friend_id.\n";
        }

        return true;
    }

    /**
     * Remove blocked users.
     *
     * @param array $array_uid The array of user ids to be unblocked.
     *
     * @return bool Returns true if successful or false otherwise.
     */
    function unblockUser($array_uid)
    {
        if ($this->bool_login == false) {
            return false;
        }

        if (!is_array($array_uid)) {
            return false;
        }

        foreach ($array_uid as $friend_id) {
            $this->http_client->post($this->plurk_paths['friends_remove_block'],
                array('friend_id' => $friend_id));
            $response = $this->http_client->currentResponse();

            echo "Removed blocked friend id $friend_id.\n";
        }

        return true;
    }

    /**
     * Get my list of blocked users.
     *
     * @return array Returns an array of blocked users.
     */
    function getBlockedUsers()
    {
        if ($this->bool_login == false) {
            return false;
        }

        $this->http_client->post($this->plurk_paths['friends_get_blocked'],
            array('offset' => 0, 'user_id' => $this->uid));
        $response = $this->http_client->currentResponse();

        return Services_Json_Json_decode($response['body'], true);
    }

    
    /**
     * Mute or unmute plurks
     *
     * @param array $int_plurk_id The plurk id to be muted/unmuted.
     * @param bool  $bool_setmute If true, this plurk is to be muted, else, 
     *                            unmute it.
     *
     * @return bool Returns true if successful or false otherwise.
     */
    function mutePlurk($int_plurk_id, $bool_setmute)
    {
        if ($this->bool_login == false) {
            return false;
        }

        if (!is_int($int_plurk_id) || ! is_bool($bool_setmute)) {
            return false;
        }

        $int_setmute = 0;
        if ($bool_setmute == true) {
            $int_setmute = 1;
        }

        $this->http_client->post($this->plurk_paths['plurk_mute'],
            array('plurk_id' => $int_plurk_id, 'value' => $int_setmute));
        $response = $this->http_client->currentResponse();

        if ($response['body'] == $int_setmute) {
            return true;
        }

        return false;
    }


    /**
     * Deletes a plurks.
     *
     * @param array $int_plurk_id The plurk id to be deleted.
     *
     * @return bool Returns true if successful or false otherwise.
     */
    function deletePlurk($int_plurk_id)
    {
        if ($this->bool_login == false) {
            return false;
        }

        if (!is_int($int_plurk_id)) {
            return false;
        }

        $this->http_client->post($this->plurk_paths['plurk_delete'],
            array('plurk_id' => $int_plurk_id));
        $response = $this->http_client->currentResponse();

        if ($response['body'] == 'ok') {
            return true;
        }
        return false;
    }

    /**
     * Gets the plurks for the user. Only 25 plurks are fetch at a time as this 
     * is limited on the server.
     * The array returned is ordered most recent post first followed by 
     * previous posts.
     *
     * @param int    $int_uid         The UID to fetch plurks for.
     * @param string $date_from       The date/time to start fetching plurks. This 
     *                                must be in the <yyyy-mm-dd>T<hh:mm:ss> format 
     *                                assumed to be UTC time.
     * @param string $date_offset     The date/time offset that fetches plurks 
     *                                earlier than this offset. The format is 
     *                                the same as $date_from.
     * @param bool   $fetch_responses If true, populate the responses_fetch value 
     *                                with the array of responses.
     *
     * @return array The array (numerical) of plurks (an associative subarray).
     */
    function getPlurks($int_uid = null, $date_from = null, $date_offset = null, 
        $fetch_responses = false)
    {
        $uid = -1;    
        if ($int_uid != null && is_int($int_uid)) {
            $uid = $int_uid;
        } else {
            $uid = $this->uid;
        }
        
        $data = '[]';

        $array_query = array();

        $array_query['user_id'] = $uid;
        if ($date_from == null) {
            $this->http_client->post($this->plurk_paths['plurk_get'], 
                $array_query);
            $data = $this->http_client->currentResponse();
            $data = $data['body'];
        } else {

            if (isset($date_from) && $date_from != null) {
                $array_query['from_date'] = $date_from;

                if (isset($date_offset) && $date_offset != null) {
                    $array_query['offset'] = $date_offset;
                }
            }

            $this->http_client->post($this->plurk_paths['plurk_get'], 
                $array_query);
            $data = $this->http_client->currentResponse();
            $data = $data['body'];
        }

        $array_plurks = RLPlurkAPI::dejsonize($data);

        foreach ($array_plurks as &$plurk) {
            $plurk['nick_name'] = $this->uidToNickname((int) $plurk['owner_id']);

            $plurk['responses_fetched'] = null;
            if ($fetch_responses == true) {
                $plurk['responses_fetched'] = 
                    $this->plurk_get_responses($plurk['plurk_id']);
            }
            $plurk['permalink'] = RLPlurkAPI::getPermalink($plurk['plurk_id']);
        }

        return $array_plurks;
    }

    /**
     * Get the unread plurks.
     *
     * @param bool $fetch_responses If true, populate the responses_fetch value 
     *                              with the array of responses.
     *
     * @return array The array (numerical) of unread plurks (an associative 
     *               subarray).
     */
    function getUnreadPlurks($fetch_responses = false)
    {
        if ($this->bool_login == false) {
            return array();
        }

        $this->http_client->get($this->plurk_paths['plurk_get_unread']); 
        $data = $this->http_client->currentResponse();
        $data = $data['body'];

        $array_plurks = RLPlurkAPI::dejsonize($data);

        foreach ($array_plurks as &$plurk) {
            $plurk['nick_name'] = $this->uidToNickname((int) $plurk['owner_id']);

            $plurk['responses_fetched'] = null;

            if ($fetch_responses == true) {
                $plurk['responses_fetched'] = 
                    $this->plurk_get_responses($plurk['plurk_id']);
            }
            $plurk['permalink'] = RLPlurkAPI::getPermalink($plurk['plurk_id']);
        }

        return $array_plurks;
    }


    /**
     * Translates a uid to the corresponding nickname.
     *
     * @param int $uid The uid to be translated.
     *
     * @return string The nick_name corresponding to the given uid.
     */
    function uidToNickname($uid)
    {
        if (!is_int($uid)) {
            return false;
        }

        if ($uid == $this->uid) {
            return (string) $this->nick_name;
        }

        foreach ($this->friends as $friend) {
            if ($friend['uid'] == $uid) {
                return (string) $friend['nick_name'];
            }
        }

        /*
         * We don't know who this is, just return the string "User $uid"
         */
        return 'User ' . $uid;

    }

    /**
     * Respond to a plurk.
     *
     * @param int    $int_plurk_id     The plurk ID number to respond to.
     * @param string $string_lang      The plurk language.
     * @param string $string_qualifier The qualifier to use for this response.
     * @param string $string_content   The content to be posted as a reply.
     *
     * @return mixed false on failure, otherwise the http response from plurk.
     */
    function respondToPlurk(
        $int_plurk_id,
        $string_lang,
        $string_qualifier,
        $string_content
    )
    {
        if ($this->bool_login == false) {
            return false;
        }

        if (!is_int($int_plurk_id) ||
            ! is_string($string_lang) ||
            ! is_string($string_qualifier) ||
            ! is_string($string_content)
        ) {
            return false;
        }

        $posted_ = gmdate('c');
        $posted_ = explode('+', $posted_);
        $posted  = urlencode($posted_[0]);

        $qualifier = urlencode(':');
        if ($string_qualifier != '') {
            $qualifier = urlencode($string_qualifier);
        }

        if (strlen($string_content) > 140) {
            return false;
        }
        $content = urlencode($string_content);

        $array_query = array(
            'posted'      => $posted,
            'qualifier'   => $qualifier,
            'content'     => $content,
            'lang'        => $string_lang,
            'p_uid'       => $this->uid,
            'uid'         => $this->uid,
            'plurk_id'    => $int_plurk_id,
        );

        $this->http_client->post($this->plurk_paths['plurk_respond'],
            $array_query, true);
        $array_response = $this->http_client->currentResponse();

        return $array_response['body'];
    }

    /**
     * Get the responses of a plurk. This method will load "temporary" friends 
     * who have responded to the plurk.
     *
     * @param int $int_plurk_id The plurk ID 
     *
     * @return array The array of responses.
     */
    function getResponses($int_plurk_id)
    {
        $this->http_client->post($this->plurk_paths['plurk_get_responses'],
            array('plurk_id' => $int_plurk_id)); 
            
        $data            = $this->http_client->currentResponse();
        $string_response = $data['body'];
        
        $data = explode('"responses": ', $string_response);

        preg_match('/\{"friends": \{"\d+": (.*)\}, "responses/', $data[0], 
            $local_friend);

        if (isset($local_friend[1])) {
            $temp_friends = array();

            $each_friend_almost_json = preg_split('/\}, "\d+": \{/', 
                $local_friend[1]);

            foreach ($each_friend_almost_json as $friend_data) {
                if (substr($friend_data, 0, 1) != '{') {
                    $friend_data = '{' . $friend_data;
                }

                if (substr($friend_data, strlen($friend_data)-1, 
                    strlen($friend_data)) != '}') {
                    $friend_data = $friend_data . '}';
                }

                $temp_friends = array_merge($temp_friends, 
                    RLPlurkAPI::dejsonize($friend_data));
            }
            $this->friends = array_merge($this->friends, $temp_friends);
        }

        $responses = array();
        if (isset($data[1])) {
            $response_data = substr($data[1], 0, strlen($data[1])-1);

            $responses = RLPlurkAPI::dejsonize($response_data);

            foreach ($responses as &$each_response) {
                $each_response['nick_name'] = 
                    $this->uidToNickname($each_response['user_id']);
            }
        }

        return $responses;
    }

    /**
     * Retrieve a user's uid from given his/her plurk nick name.
     * 
     * @param string $string_nick_name The nickname of the user to retrieve the 
     *                                 uid from.
     *
     * @return int The uid of the given nickname.
     */
    function nicknameToUid($string_nick_name)
    {
        if (!is_string($string_nick_name) || $string_nick_name == '') {
            return -1;
        }

        $this->http_client->get("{$this->plurk_paths['http_base']}" .
            "/user/{$string_nick_name}");
        $array_profile = $this->http_client->currentResponse();

        if (!preg_match('/var GLOBAL = \{.*"uid": ([\d]+),.*\}/imU', 
            $array_profile['body'], $matches)) {
            return -1;
        }

        return (int )$matches[1];
    }

    /**
     * Retrieve a user's information given a plurk uid.
     * 
     * @param int $int_uid The uid of the plurk member.
     *
     * @return array The associative array of user information.
     */
    function uidToUserinfo($int_uid)
    {
        if (! is_int($int_uid)) {
            return array();
        }

        $this->http_client->get($this->plurk_paths['user_get_info'],
            array('user_id' => $int_uid));

        $array_profile = $this->http_client->currentResponse();

        if ($array_profile['code'] == 500) {
            return array();
        }

        return Services_Json_Json_decode($array_profile['body'], true);
    }

    

    /**
     * Convert a plurk ID to a permalink URL.
     *
     * @param int $plurk_id The plurk ID number.
     *
     * @return string The permalink URL address.
     */
    public static function getPermalink($plurk_id)
    {
        if (!is_int($plurk_id)) {
            return '';
        }

        return "http://www.plurk.com/p/" . base_convert($plurk_id, 10, 36);
    }

    /**
     * Convert a plurk permalink URL address to a plurk ID.
     *
     * @param string $string_permalink The plurk permalink URL address.
     *
     * @return int The plurk ID number.
     */
    public static function permalinkToPlurkID($string_permalink)
    {
        $base36number = str_replace('http://www.plurk.com/p/', '', 
            $string_permalink);

        return (int) base_convert($base36number, 36, 10);
    }

}



?>
