<?php

class Session
{
    public function __construct($id, $username, $role_id)
    {
        ini_set('session.gc_maxlifetime', 36000);
        session_set_cookie_params(36000);
        session_start();
        $_SESSION['username'] = $username;
        $_SESSION['id'] = $id;
        $_SESSION['role_id'] = $role_id;
        $_SESSION['authuser'] = TRUE;
    }
}