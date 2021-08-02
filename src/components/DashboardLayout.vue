<!--@format-->

<template>
  <div class="dashboard">
    <v-navigation-drawer
      v-model="drawer"
      class="fullheight"
      width="315"
      color="#11698e"
      app
    >
      <v-list-item>
        <v-list-item-content>
          <marquee direction="left" width="100">
            <v-list-item-subtitle class="yellow--text">
              Jadwal Vidcon Vidwall
            </v-list-item-subtitle>
          </marquee>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          tag="router-link"
          :to="item.to"
          
        >
          <v-list-item-content class="white--text">
            <v-list-item-title> {{ item.title }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
    <v-app-bar app fixed height="75px" color="#11698e">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <VSpacer />
      <!-- <v-toolbar-items>   
        <v-btn @click="logout" text router class="mx-2"  color="red"><v-icon>mdi-logout-variant</v-icon></v-btn>
      </v-toolbar-items> -->
    </v-app-bar>
    <div class="fullheight pa-5">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "Dashboard",
  data() {
    return {
      drawer: true,
      items: [
        { title: "Jadwal Vidcon Hari Ini", to: "/jadwalVidconToday" },
        // { title: "Dashboard", to: "/dashboard" },
        { title: "List Jadwal Vidcon", to: "/jadwalVidcon" },
      ],
    };
  },

  methods: {
    
  },
};
</script>

<style scoped>
/* .fullheight {
  min-height: 100vh !important;
} */
.router {
  text-decoration: none;
  color: black;
}
</style>
