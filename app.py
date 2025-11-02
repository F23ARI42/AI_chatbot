from flask import Flask, render_template, jsonify, request
import json
import time
from datetime import datetime
import os

app = Flask(__name__)

# Knowledge base for responses
KNOWLEDGE_BASE = {
    'algorithms': {
        'response': """**Algorithms** - Step-by-step procedures for problem-solving

## Core Concepts:
• **Time Complexity**: Runtime growth analysis
  - O(1): Constant time
  - O(log n): Logarithmic efficiency  
  - O(n): Linear scaling
  - O(n²): Quadratic growth

• **Space Complexity**: Memory usage patterns

## Key Algorithms:
- **Sorting**: QuickSort, MergeSort, BubbleSort
- **Searching**: Binary Search, Linear Search
- **Graph Theory**: Dijkstra, BFS, DFS

*Need specific algorithm details? Just ask!*""",
        'examples': ['binary search', 'quick sort', 'dynamic programming']
    },
    'data structures': {
        'response': """**Data Structures** - Efficient data organization methods

## Structure Types:
• **Arrays**: Contiguous memory, instant access
• **Linked Lists**: Dynamic sizing, sequential access  
• **Stacks**: LIFO principle
• **Queues**: FIFO processing
• **Trees**: Hierarchical organization
• **Graphs**: Network relationships
• **Hash Tables**: Key-value mapping

## Usage Guide:
- **Arrays**: Fixed size, random access needed
- **Linked Lists**: Frequent insertions/deletions
- **Hash Tables**: Fast lookup requirements
- **Trees**: Sorted or hierarchical data

*Which structure interests you most?*""",
        'examples': ['arrays vs linked lists', 'hash table implementation', 'tree traversal']
    },
    'machine learning': {
        'response': """**Machine Learning** - AI-driven pattern recognition

## Learning Paradigms:
• **Supervised**: Labeled data training
• **Unsupervised**: Pattern discovery  
• **Reinforcement**: Reward-based learning

## Core Algorithms:
- Linear/Logistic Regression
- Decision Trees & Random Forests
- Neural Networks & Deep Learning
- K-Means Clustering

## Applications:
- Computer Vision
- Natural Language Processing  
- Recommendation Engines
- Predictive Analytics

*Ready to dive deeper into ML concepts?*""",
        'examples': ['neural networks', 'linear regression', 'clustering algorithms']
    },
    'cloud computing': {
        'response': """**Cloud Computing** - On-demand computing services

## Service Models:
• **IaaS**: Infrastructure (VMs, storage)
• **PaaS**: Development platforms  
• **SaaS**: Ready applications

## Deployment Options:
- **Public Cloud**: AWS, Azure, GCP
- **Private Cloud**: On-premises solutions
- **Hybrid Cloud**: Mixed environment

## Key Benefits:
- Scalability & Elasticity
- Cost Optimization
- Global Availability
- Managed Services

*Exploring cloud solutions for your projects?*""",
        'examples': ['aws services', 'cloud deployment', 'serverless computing']
    },
    'cybersecurity': {
        'response': """**Cybersecurity** - Digital protection systems

## Common Threats:
• **Malware**: Viruses, ransomware, trojans
• **Phishing**: Social engineering attacks
• **DDoS**: Service disruption
• **SQL Injection**: Database exploitation

## Protection Layers:
- Network Security & Firewalls
- Encryption & Access Control
- Regular Updates & Patches
- Security Awareness Training

## Best Practices:
- Principle of Least Privilege
- Defense in Depth Strategy
- Regular Security Audits
- Incident Response Planning

*Security concerns for your applications?*""",
        'examples': ['encryption', 'network security', 'vulnerability assessment']
    },
    'frontend': {
        'response': """**Frontend Development** - Crafted by **Zain Nadeem** ✨

## Developer Profile:
**Zain Nadeem** - Full-Stack Developer
- 🚀 Modern web technologies enthusiast  
- 🎨 UI/UX design passion
- 🔧 Tech stack: React, Node.js, Python

## Connect:
- **GitHub**: [github.com/the-lazyguy](https://github.com/the-lazyguy)
- **LinkedIn**: [linkedin.com/in/zain-nadeem-917524177](https://www.linkedin.com/in/zain-nadeem-917524177/)

## Technical Excellence:
• React Hooks & Component Architecture
• Responsive Design Systems
• Dark/Light Theme Engine
• Real-time Chat Interface
• Local Storage Management
• Animated UI Components

*Built with precision and user experience focus*""",
        'examples': ['frontend', 'front end', 'ui/ux', 'gui', 'user interface', 'who made this', 'developer', 'who created this', 'who built this']
    }
}

def find_best_response(user_input):
    input_text = user_input.lower()
    
    developer_keywords = [
        'who made', 'who created', 'who built', 'who developed', 
        'developer', 'author', 'creator', 'made this', 'created this',
        'built this', 'developed this'
    ]
    
    frontend_keywords = [
        'frontend', 'front end', 'ui/ux', 'gui', 'interface', 
        'design', 'this app', 'this application', 'website', 'web app'
    ]
    
    if any(keyword in input_text for keyword in developer_keywords) or \
       any(keyword in input_text for keyword in frontend_keywords):
        return KNOWLEDGE_BASE['frontend']['response']

    for topic, data in KNOWLEDGE_BASE.items():
        if topic in input_text or any(example in input_text for example in data['examples']):
            return data['response']

    if 'time complexity' in input_text or 'big o' in input_text:
        return """**Time Complexity Analysis**

## Efficiency Metrics:
• **O(1)**: Constant time - fixed duration
• **O(n)**: Linear time - proportional growth  
• **O(n²)**: Quadratic time - squared growth
• **O(log n)**: Logarithmic time - efficient scaling

## Practical Examples:
- Binary Search: O(log n)
- Linear Search: O(n)
- Nested Loops: O(n²)

*Understanding complexity helps optimize performance*"""

    if 'python' in input_text or 'javascript' in input_text or 'java' in input_text:
        return """**Programming Languages** - Tool comparison

## Language Strengths:
• **Python**: Readable syntax, data science focus
• **JavaScript**: Web development, browser execution  
• **Java**: Enterprise systems, strong typing

## Use Cases:
- Python: ML, scripting, web backends
- JavaScript: Frontend, full-stack development
- Java: Large-scale systems, Android apps

*Which language or concept interests you?*"""

    return f"""I understand you're asking about "{user_input}". 

## Topic Analysis:
• **Core Concepts**: Foundational principles
• **Practical Applications**: Real-world usage  
• **Best Practices**: Industry standards
• **Common Challenges**: Potential obstacles

## Let me help you explore:
Would you prefer a comprehensive overview or focus on specific aspects?

*Your curiosity drives our learning journey*"""



@app.route('/')
def index():
    return render_template("script.html")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    
    time.sleep(1)
    
    response = find_best_response(user_message)
    
    return jsonify({
        'response': response,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/clear_chat', methods=['POST'])
def clear_chat():
    return jsonify({'status': 'success', 'message': 'Chat cleared'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)