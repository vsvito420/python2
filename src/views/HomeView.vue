<template>
  <div class="home">
    <h1>Python Course with AI Integration</h1>
    <p>Welcome to this interactive Python course. Learn Python programming with AI-assisted feedback.</p>
    
    <div class="course-overview">
      <h2>Course Overview</h2>
      <p>This course is designed to help you learn Python programming through interactive exercises and AI-powered feedback.</p>
      
      <h3>Features:</h3>
      <ul>
        <li>Interactive Python code editor</li>
        <li>Real-time code execution</li>
        <li>AI-powered code evaluation</li>
        <li>Immediate feedback on your solutions</li>
      </ul>
    </div>
    
    <div class="get-started">
      <h2>Get Started</h2>
      <p>Begin your Python learning journey by clicking the button below:</p>
      <router-link to="/lessons/1" class="start-button">
        <button>Start Lesson 1</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
}

h1 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.course-overview, .get-started {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

ul {
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
}

li {
  margin: 0.5rem 0;
}

.start-button {
  display: inline-block;
  margin-top: 1rem;
}

.start-button button {
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
}
</style>