export const adminMenu = [
    { //quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.crud', link: '/system/user-manage'
            },
            {
                name: 'menu.admin.crud-redux', link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-center', link: '/system/manage-center'
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
                // ]
            },
            // {
            //     name: 'menu.admin.manage-admin', link: '/system/user-admin'
            // },
            { //quản lý đặt lịch đăng kiểm
                name: 'menu.center.manage-schedule', link: '/center/manage-schedule'
            },
        ]
    },
    { //quản lý khu vực
        name: 'menu.admin.arena',
        menus: [
            {
                name: 'menu.admin.manage-arena', link: '/system/manage-arena'
            },
        ]
    },
    { //quản lý dịch vụ
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
            },
        ]
    },
    { //quản lý cảm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/manage-handbook'
            },
        ]
    },

];

export const centerMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            {//quản lý đặt lịch đăng kiểm
                name: 'menu.center.manage-schedule', link: '/center/manage-schedule'
            },
        ]
    }
]