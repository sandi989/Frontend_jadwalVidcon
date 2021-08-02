import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
     {
         
        path: "/",
        component: importComponent('DashboardLayout'),
        
        children: [           
            //Dashboard
            {
                path: "/dashboard",
                name: "Dashboard",
                meta: {title: 'Dashboard'},
                component: importComponent('Dashboard'),
            },

            //List Jadwal Vidcon
            {
                path: "/jadwalVidcon",
                name: "JadwalVidcon",
                meta: {title: 'JadwalVidcon'},
                component: importComponent('JadwalVidcon'),
            },

            //List Jadwal Vidcon
            {
                path: "/jadwalVidconToday",
                name: "JadwalVidconToday",
                meta: {title: 'JadwalVidconToday'},
                component: importComponent('JadwalVidconToday'),
            },
        ]
      },    
        {
            path: '*',
            redirect: '/'
        },
    ],
});

export default router;