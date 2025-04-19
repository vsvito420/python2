<template>
  <header>
    <div class="wrapper">
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/lessons/1">Lesson 1</router-link>
      </nav>
    </div>
  </header>

  <main>
    <router-view />
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  color: #2c3e50;
  background-color: #f5f7fa;
}

header {
  background-color: #4b6cb7;
  color: white;
  padding: 1rem;
}

nav {
  padding: 0.5rem 0;
}

nav a {
  color: white;
  text-decoration: none;
  margin: 0 0.5rem;
}

nav a.router-link-active {
  font-weight: bold;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>