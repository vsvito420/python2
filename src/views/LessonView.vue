<template>
  <div class="lesson">
    <h1>Lesson {{ id }}: Introduction to Python Variables</h1>
    
    <div class="lesson-content">
      <div class="explanation">
        <h2>Variables in Python</h2>
        <p>
          Variables are containers for storing data values. In Python, you don't need to declare a variable type, 
          and you can change the value later.
        </p>
        <pre class="code-example">
# Example of Python variables
name = "John"
age = 30
is_student = True
        </pre>
        
        <h3>Exercise:</h3>
        <p>
          Create three variables:
        </p>
        <ol>
          <li>A string variable called <code>greeting</code> with the value "Hello, Python!"</li>
          <li>An integer variable called <code>year</code> with the current year</li>
          <li>A boolean variable called <code>is_fun</code> set to True</li>
        </ol>
        <p>Then print all three variables.</p>
      </div>
      
      <div class="code-editor-container">
        <h3>Your Solution:</h3>
        <div class="code-editor" ref="editorContainer"></div>
        
        <div class="editor-controls">
          <button @click="runCode" :disabled="isRunning">Run Code</button>
          <button @click="evaluateCode" :disabled="isEvaluating || !codeRun">Submit for Evaluation</button>
        </div>
        
        <div v-if="output" class="code-output">
          <h4>Output:</h4>
          <pre>{{ output }}</pre>
        </div>
      </div>
    </div>
    
    <div v-if="feedback" class="feedback" :class="{ error: feedback.error }">
      <h3>AI Evaluation:</h3>
      <div v-html="feedback.message"></div>
      
      <div v-if="feedback.suggestions && feedback.suggestions.length > 0" class="suggestions">
        <h4>Suggestions:</h4>
        <ul>
          <li v-for="(suggestion, index) in feedback.suggestions" :key="index">
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import * as monaco from 'monaco-editor';
import { loadPyodide } from 'pyodide';

export default {
  setup() {
    const route = useRoute();
    const id = ref(route.params.id);
    const editorContainer = ref(null);
    const editor = ref(null);
    const pyodide = ref(null);
    const isRunning = ref(false);
    const isEvaluating = ref(false);
    const output = ref('');
    const feedback = ref(null);
    const codeRun = ref(false);
    
    // Initial code template
    const initialCode = `# Write your solution here
# 1. Create a string variable called greeting
# 2. Create an integer variable called year
# 3. Create a boolean variable called is_fun
# 4. Print all three variables

`;

    onMounted(async () => {
      // Initialize Monaco Editor
      if (editorContainer.value) {
        editor.value = monaco.editor.create(editorContainer.value, {
          value: initialCode,
          language: 'python',
          theme: 'vs',
          minimap: { enabled: false },
          automaticLayout: true,
          fontSize: 14,
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto'
          }
        });
      }
      
      // Initialize Pyodide for running Python code in the browser
      loadPyodideRuntime();
    });
    
    // Function to load Pyodide runtime
    const loadPyodideRuntime = async () => {
      output.value = 'Loading Python runtime... This may take a moment.';
      
      try {
        // Load Pyodide with a specific URL to ensure we get the right version
        pyodide.value = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
        });
        
        output.value = 'Python runtime loaded successfully. You can now run your code.';
        console.log('Pyodide loaded successfully');
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
        output.value = `Error loading Python runtime: ${error.message}\nPlease refresh the page and try again.`;
      }
    };
    
    onUnmounted(() => {
      if (editor.value) {
        editor.value.dispose();
      }
    });
    
    // Run Python code in the browser using Pyodide
    const runCode = async () => {
      if (!pyodide.value) {
        output.value = 'Python runtime is not loaded yet. Attempting to load...';
        await loadPyodideRuntime();
        
        if (!pyodide.value) {
          output.value = 'Failed to load Python runtime. Please refresh the page and try again.';
          return;
        }
      }
      
      isRunning.value = true;
      output.value = 'Running code...';
      
      try {
        const code = editor.value.getValue();
        
        // Capture stdout
        pyodide.value.setStdout({
          batched: (stdout) => {
            output.value = stdout || 'Code executed successfully, but produced no output.';
          }
        });
        
        // Run the code
        await pyodide.value.runPythonAsync(code);
        
        // If no output was captured, provide a message
        if (!output.value || output.value === 'Running code...') {
          output.value = 'Code executed successfully, but produced no output.';
        }
        
        codeRun.value = true;
      } catch (error) {
        output.value = `Error: ${error.message}`;
      } finally {
        isRunning.value = false;
      }
    };
    
    // Submit code for AI evaluation
    const evaluateCode = async () => {
      if (!codeRun.value) {
        feedback.value = {
          error: true,
          message: 'Please run your code first before submitting for evaluation.'
        };
        return;
      }
      
      isEvaluating.value = true;
      feedback.value = null;
      
      try {
        const code = editor.value.getValue();
        
        const response = await fetch('/api/evaluate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code,
            lessonId: id.value,
            output: output.value
          })
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        feedback.value = await response.json();
      } catch (error) {
        feedback.value = {
          error: true,
          message: `Failed to evaluate code: ${error.message}`,
          suggestions: [
            'Check your internet connection',
            'Try again in a few moments'
          ]
        };
      } finally {
        isEvaluating.value = false;
      }
    };
    
    return {
      id,
      editorContainer,
      isRunning,
      isEvaluating,
      output,
      feedback,
      codeRun,
      runCode,
      evaluateCode
    };
  }
};
</script>

<style scoped>
.lesson {
  max-width: 1000px;
  margin: 0 auto;
}

.lesson-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .lesson-content {
    grid-template-columns: 1fr;
  }
}

.explanation {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.code-example {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
}

.code-editor-container {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.code-editor {
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.editor-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.code-output {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  margin-top: 1rem;
}

.feedback {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--success-color);
}

.feedback.error {
  border-left-color: var(--error-color);
}

.suggestions {
  margin-top: 1rem;
}
</style>