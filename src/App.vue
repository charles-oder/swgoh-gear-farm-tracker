<template>
  <div id="app">
    <div id="nav">
      <router-link to="/characters">Character Setup</router-link> |
      <router-link to="/gear-on-hand">Gear On Hand</router-link> |
      <router-link to="/gear-needed-per-character">Gear Needed/Character</router-link> |
      <router-link to="/gear-needed-total">Total Gear Needed</router-link> |
      <router-link to="/farm-list">Farm List</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
