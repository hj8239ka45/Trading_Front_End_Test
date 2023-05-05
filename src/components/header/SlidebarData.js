//doesn't use in this version
import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
// sidebar 
export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Index',
        path: '/index',
        icon: <AiIcons.AiFillControl />,
        cName: 'nav-text'
    },

    {
        title: 'Action',
        path: '/action',
        icon: <AiIcons.AiFillTool />,
        cName: 'nav-text'
    }
]