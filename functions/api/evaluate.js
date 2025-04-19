/**
 * Evaluates Python code using the requesty.ai API
 * @param {string} code - The Python code to evaluate
 * @param {string} lessonId - The ID of the lesson
 * @param {string} output - The output from running the code
 * @param {string} apiKey - The requesty.ai API key
 * @returns {Object} - The evaluation result
 */
export async function evaluateCode(code, lessonId, output, apiKey) {
  try {
    // Define the prompt for the AI based on the lesson
    const prompt = createPromptForLesson(lessonId, code, output);
    
    // Call the requesty.ai API
    const response = await fetch('https://requesty.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://python-course-ai.pages.dev', // Main domain for the Pages project
        'X-Title': 'Python Course AI'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful Python teaching assistant. Your job is to evaluate student code submissions and provide constructive feedback. Be encouraging but also point out areas for improvement. Format your response in HTML for better readability.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // Extract the AI's response
    const aiResponse = data.choices[0].message.content;
    
    // Parse the AI response to extract feedback and suggestions
    return parseAIResponse(aiResponse);
  } catch (error) {
    console.error('Error evaluating code:', error);
    return {
      error: true,
      message: `Failed to evaluate code: ${error.message}`,
      suggestions: [
        'Check your internet connection',
        'Verify your API key is correct',
        'Try again in a few moments'
      ]
    };
  }
}

/**
 * Creates a prompt for the AI based on the lesson
 * @param {string} lessonId - The ID of the lesson
 * @param {string} code - The Python code to evaluate
 * @param {string} output - The output from running the code
 * @returns {string} - The prompt for the AI
 */
function createPromptForLesson(lessonId, code, output) {
  // For now, we only have one lesson
  if (lessonId === '1') {
    return `
Please evaluate the following Python code for Lesson 1: Introduction to Python Variables.

The task was to:
1. Create a string variable called 'greeting' with the value "Hello, Python!"
2. Create an integer variable called 'year' with the current year
3. Create a boolean variable called 'is_fun' set to True
4. Print all three variables

Here is the student's code:
\`\`\`python
${code}
\`\`\`

And here is the output when the code was run:
\`\`\`
${output}
\`\`\`

Please evaluate if the code correctly implements all requirements. Provide specific feedback on:
1. Whether all variables were created with the correct names and types
2. If the printing was done correctly
3. Any style issues or best practices that could be improved
4. Any errors or bugs in the code

Format your response with HTML tags for better readability. Include specific suggestions for improvement if needed.
`;
  }
  
  // Default prompt for other lessons (can be expanded later)
  return `
Please evaluate the following Python code for Lesson ${lessonId}.

Here is the student's code:
\`\`\`python
${code}
\`\`\`

And here is the output when the code was run:
\`\`\`
${output}
\`\`\`

Please provide detailed feedback on the code implementation, correctness, and style.
Format your response with HTML tags for better readability.
`;
}

/**
 * Parses the AI response to extract feedback and suggestions
 * @param {string} aiResponse - The raw response from the AI
 * @returns {Object} - The parsed feedback
 */
function parseAIResponse(aiResponse) {
  // For now, we'll just return the raw AI response as the message
  // In a more advanced implementation, we could parse the response to extract
  // specific feedback points, suggestions, etc.
  
  // Check if the response indicates success or error
  const isError = aiResponse.toLowerCase().includes('error') || 
                 aiResponse.toLowerCase().includes('incorrect') ||
                 aiResponse.toLowerCase().includes('mistake');
  
  // Extract suggestions if any (look for bullet points or numbered lists)
  const suggestionMatches = aiResponse.match(/<li>(.*?)<\/li>/g);
  const suggestions = suggestionMatches 
    ? suggestionMatches.map(match => {
        // Remove HTML tags to get just the text
        return match.replace(/<\/?li>/g, '').trim();
      })
    : [];
  
  return {
    error: isError,
    message: aiResponse,
    suggestions: suggestions
  };
}