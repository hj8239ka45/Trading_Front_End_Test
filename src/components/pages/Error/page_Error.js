/* eslint-disable react/jsx-pascal-case */
import React, { useEffect, useState } from 'react';

// 更新研究 AJAX、Long polling、Web Socket、Fetch

const NotFound = ({history}) => {
    return(
        <div>
            <h1>404</h1>
            <h3>page not found</h3>
            <p>We are sorry but the page you are looking for does not exist.</p>
            <p>Redirecting to <span style={{ color: "blue" }} onClick={() => history.push('/')}>Login</span></p>
        </div >
    );
}
export default NotFound