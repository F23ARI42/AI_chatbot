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

HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CS Assistant</title>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        :root {
            --primary: #2A2A2A;
            --secondary: #8B7355;
            --accent: #666666;
            --background: #0A0A0A;
            --surface: #1A1A1A;
            --text: #F5F5F5;
            --text-secondary: #B0B0B0;
            --gradient: linear-gradient(135deg, #2A2A2A 0%, #8B7355 50%, #666666 100%);
            --gradient-animated: linear-gradient(45deg, #2A2A2A, #8B7355, #666666, #8B7355);
            --sparkle-color: #8B7355;
        }

        [data-theme="light"] {
            --primary: #2A2A2A;
            --secondary: #8B7355;
            --accent: #666666;
            --background: #F8F8F8;
            --surface: #FFFFFF;
            --text: #1A1A1A;
            --text-secondary: #4A4A4A;
            --gradient: linear-gradient(135deg, #2A2A2A 0%, #8B7355 50%, #666666 100%);
            --gradient-animated: linear-gradient(45deg, #2A2A2A, #8B7355, #666666, #8B7355);
            --sparkle-color: #D4A574;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: var(--background);
            color: var(--text);
            overflow: hidden;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .hidden {
            display: none !important;
        }

        /* Particle Background - Always Visible */
        .particles-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }

        .particle {
            position: absolute;
            background: var(--secondary);
            border-radius: 50%;
            opacity: 0.3;
            animation: floatParticle 20s infinite ease-in-out;
        }

        /* Welcome Screen */
        .welcome-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--background);
            z-index: 1000;
            transition: background-color 0.3s ease;
        }

        .welcome-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, transparent 0%, var(--background) 100%);
            z-index: 2;
        }

        .welcome-content {
            text-align: center;
            z-index: 3;
            padding: 40px 20px;
            max-width: 800px;
            position: relative;
        }

        .logo-container {
            margin-bottom: 40px;
            animation: scaleIn 0.5s ease-out;
        }

        .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto 20px;
            border-radius: 30px;
            background: var(--gradient-animated);
            background-size: 300% 300%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 
                0 0 60px rgba(139, 115, 85, 0.6),
                0 0 100px rgba(139, 115, 85, 0.4),
                inset 0 0 60px rgba(255, 255, 255, 0.1);
            animation: 
                logoFloat 4s ease-in-out infinite,
                gradientShift 8s ease infinite,
                logoGlow 3s ease-in-out infinite;
            border: 3px solid rgba(139, 115, 85, 0.3);
            position: relative;
            overflow: hidden;
        }

        .logo::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                45deg,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
            );
            transform: rotate(45deg);
            animation: logoShine 4s infinite;
        }

        .logo::after {
            content: '';
            position: absolute;
            inset: -5px;
            background: conic-gradient(
                from 0deg,
                transparent,
                var(--secondary),
                transparent 360deg
            );
            border-radius: 30px;
            animation: logoRotate 4s linear infinite;
            opacity: 0.5;
            filter: blur(10px);
            z-index: -1;
        }

        .logo-icon {
            width: 56px;
            height: 56px;
            color: #FFFFFF;
            stroke-width: 2.5;
            position: relative;
            z-index: 1;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
            animation: iconPulse 2s ease-in-out infinite;
        }

        .welcome-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 800;
            margin: 0 0 24px 0;
            background: var(--gradient-animated);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.5px;
            line-height: 1.1;
            animation: gradientShift 8s ease infinite;
        }

        .welcome-description {
            font-size: clamp(1.1rem, 2vw, 1.3rem);
            color: var(--text-secondary);
            margin: 0 0 50px 0;
            line-height: 1.6;
            transition: opacity 0.5s ease;
            text-align: center;
            animation: fadeInUp 1s ease-out 0.5s backwards;
        }

        .social-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 60px;
            opacity: 0;
            transition: opacity 0.5s ease 0.2s;
            flex-wrap: wrap;
        }

        .modern-social-btn {
            position: relative;
            padding: 16px 32px;
            background: rgba(26, 26, 26, 0.6);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(139, 115, 85, 0.3);
            border-radius: 16px;
            color: #FFFFFF;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            overflow: hidden;
            box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            cursor: pointer;
        }

        [data-theme="light"] .modern-social-btn {
            background: rgba(255, 255, 255, 0.8);
            color: var(--text);
        }

        .modern-social-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--gradient);
            opacity: 0;
            transition: opacity 0.5s;
            z-index: 0;
        }

        .modern-social-btn::after {
            content: '';
            position: absolute;
            inset: -3px;
            background: conic-gradient(
                from 0deg,
                transparent,
                var(--secondary),
                transparent 360deg
            );
            border-radius: 16px;
            opacity: 0;
            filter: blur(15px);
            z-index: -1;
            animation: socialRotate 4s linear infinite;
            transition: opacity 0.5s;
        }

        .modern-social-btn:hover::before {
            opacity: 1;
        }

        .modern-social-btn:hover::after {
            opacity: 1;
        }

        .modern-social-btn:hover {
            transform: translateY(-8px) scale(1.05);
            border-color: transparent;
            box-shadow: 
                0 20px 60px rgba(139, 115, 85, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            color: #FFFFFF;
        }

        .modern-social-btn .icon {
            width: 24px;
            height: 24px;
            position: relative;
            z-index: 1;
            transition: all 0.4s ease;
        }

        .modern-social-btn:hover .icon {
            transform: scale(1.2) rotate(360deg);
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        }

        .modern-social-btn span {
            position: relative;
            z-index: 1;
            letter-spacing: 0.5px;
        }

        /* Ultra-Premium CTA Button */
        .cta-button {
            opacity: 0;
            transition: opacity 0.5s ease 0.2s;
            position: relative;
            margin: auto;
            padding: 0;
            border: none;
            background: none;
            cursor: pointer;
            overflow: visible;
        }

        .cta-button-inner {
            position: relative;
            padding: 22px 60px;
            font-size: 1.2rem;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #FFFFFF;
            background: var(--gradient-animated);
            background-size: 300% 300%;
            border-radius: 60px;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            animation: gradientShift 8s ease infinite;
            box-shadow: 
                0 15px 50px rgba(139, 115, 85, 0.5),
                0 5px 15px rgba(0, 0, 0, 0.3),
                inset 0 2px 0 rgba(255, 255, 255, 0.3),
                inset 0 -2px 8px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .cta-button-inner::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.4),
                transparent
            );
            transition: left 0.7s ease;
            z-index: 1;
        }

        .cta-button:hover .cta-button-inner::before {
            left: 100%;
        }

        .cta-button::after {
            content: '';
            position: absolute;
            inset: -4px;
            background: conic-gradient(
                from 0deg,
                var(--secondary),
                var(--sparkle-color),
                var(--secondary),
                var(--sparkle-color),
                var(--secondary)
            );
            border-radius: 60px;
            opacity: 0;
            filter: blur(20px);
            z-index: -1;
            animation: ctaRotate 4s linear infinite;
            transition: opacity 0.5s;
        }

        .cta-button:hover::after {
            opacity: 1;
        }

        .cta-button:hover .cta-button-inner {
            transform: scale(1.08);
            box-shadow: 
                0 25px 80px rgba(139, 115, 85, 0.7),
                0 10px 25px rgba(0, 0, 0, 0.4),
                inset 0 2px 0 rgba(255, 255, 255, 0.4),
                inset 0 -2px 10px rgba(0, 0, 0, 0.3);
        }

        .cta-sparkle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: var(--sparkle-color);
            border-radius: 50%;
            box-shadow: 0 0 20px var(--sparkle-color);
            animation: sparkle 2s infinite;
            pointer-events: none;
        }

        .cta-sparkle:nth-child(1) {
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }

        .cta-sparkle:nth-child(2) {
            top: 70%;
            left: 80%;
            animation-delay: 0.7s;
        }

        .cta-sparkle:nth-child(3) {
            top: 40%;
            right: 5%;
            animation-delay: 1.4s;
        }

        .cta-text {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .cta-arrow {
            display: flex;
            align-items: center;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            position: relative;
            z-index: 2;
        }

        .cta-arrow svg {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
        }

        .cta-button:hover .cta-arrow {
            transform: translateX(10px);
            animation: arrowBounce 0.8s ease-in-out infinite;
        }

        .cta-glow {
            position: absolute;
            inset: -20px;
            background: radial-gradient(
                circle,
                rgba(139, 115, 85, 0.4) 0%,
                transparent 70%
            );
            opacity: 0;
            transition: opacity 0.5s;
            pointer-events: none;
            animation: glowPulse 3s ease-in-out infinite;
        }

        .cta-button:hover .cta-glow {
            opacity: 1;
        }

        /* Chat Interface - FULL SCREEN */
        .chat-interface {
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            background-color: transparent;
            color: var(--text);
            overflow: hidden;
            transition: background-color 0.3s ease;
            z-index: 100;
        }

        /* Enhanced Header */
        .chat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 32px;
            background: rgba(26, 26, 26, 0.7);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(139, 115, 85, 0.2);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
            flex-shrink: 0;
            position: relative;
            z-index: 10;
            transition: background-color 0.3s ease;
        }

        [data-theme="light"] .chat-header {
            background: rgba(255, 255, 255, 0.8);
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .header-logo {
            width: 45px;
            height: 45px;
            border-radius: 14px;
            background: var(--gradient-animated);
            background-size: 300% 300%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 
                0 8px 25px rgba(139, 115, 85, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            animation: 
                headerLogoFloat 3s ease-in-out infinite,
                gradientShift 8s ease infinite;
            position: relative;
            overflow: hidden;
        }

        .header-logo::before {
            content: '';
            position: absolute;
            inset: -100%;
            background: linear-gradient(
                45deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            animation: headerLogoShine 3s infinite;
        }

        .header-icon {
            width: 24px;
            height: 24px;
            color: #FFFFFF;
            stroke-width: 2.5;
            position: relative;
            z-index: 1;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .header-text h1 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 800;
            background: var(--gradient-animated);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 8s ease infinite;
        }

        .status {
            font-size: 0.8rem;
            opacity: 0.8;
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--text-secondary);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--secondary);
            animation: statusPulseGlow 2s infinite;
            box-shadow: 0 0 20px var(--secondary);
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .header-action-btn {
            position: relative;
            padding: 10px 18px;
            background: rgba(139, 115, 85, 0.1);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(139, 115, 85, 0.3);
            border-radius: 12px;
            color: var(--text);
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            overflow: hidden;
        }

        [data-theme="light"] .header-action-btn {
            background: rgba(255, 255, 255, 0.6);
        }

        .header-action-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--gradient);
            opacity: 0;
            transition: opacity 0.4s;
            z-index: 0;
        }

        .header-action-btn::after {
            content: '';
            position: absolute;
            inset: -2px;
            background: conic-gradient(
                from 0deg,
                transparent,
                var(--secondary),
                transparent 360deg
            );
            border-radius: 12px;
            opacity: 0;
            filter: blur(8px);
            z-index: -1;
            animation: btnRotate 3s linear infinite;
            transition: opacity 0.4s;
        }

        .header-action-btn:hover::before {
            opacity: 1;
        }

        .header-action-btn:hover::after {
            opacity: 0.8;
        }

        .header-action-btn > * {
            position: relative;
            z-index: 1;
        }

        .header-action-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 10px 30px rgba(139, 115, 85, 0.4);
            color: #FFFFFF;
            border-color: transparent;
        }

        .icon-btn {
            width: 50px;
            height: 50px;
            border-radius: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border: 2px solid rgba(139, 115, 85, 0.3);
            background: rgba(139, 115, 85, 0.1);
            backdrop-filter: blur(10px);
            overflow: hidden;
        }

        [data-theme="light"] .icon-btn {
            background: rgba(255, 255, 255, 0.6);
        }

        .icon-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--gradient);
            opacity: 0;
            transition: opacity 0.4s;
            z-index: 0;
        }

        .icon-btn::after {
            content: '';
            position: absolute;
            inset: -2px;
            background: conic-gradient(
                from 0deg,
                transparent,
                var(--secondary),
                transparent 360deg
            );
            border-radius: 13px;
            opacity: 0;
            filter: blur(8px);
            z-index: -1;
            animation: btnRotate 3s linear infinite;
            transition: opacity 0.4s;
        }

        .icon-btn:hover::before {
            opacity: 1;
        }

        .icon-btn:hover::after {
            opacity: 0.8;
        }

        .icon-btn svg {
            position: relative;
            z-index: 1;
            color: var(--text);
            transition: all 0.4s ease;
        }

        .icon-btn:hover {
            transform: translateY(-4px) scale(1.08);
            box-shadow: 0 12px 35px rgba(139, 115, 85, 0.5);
            border-color: transparent;
        }

        .icon-btn:hover svg {
            color: #FFFFFF;
        }

        .icon-btn.download-btn:hover svg {
            animation: downloadBounce 0.6s ease infinite;
        }

        .icon-btn.delete-btn {
            background: rgba(255, 107, 107, 0.1);
            border-color: rgba(255, 107, 107, 0.3);
        }

        .icon-btn.delete-btn::before {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        }

        .icon-btn.delete-btn::after {
            background: conic-gradient(
                from 0deg,
                transparent,
                #ff6b6b,
                transparent 360deg
            );
        }

        .icon-btn.delete-btn:hover svg {
            animation: deleteShake 0.5s ease infinite;
        }

        /* Enhanced Theme Switch - Matching Chatbot Theme */
        .theme-switch-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .theme-switch-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text);
            opacity: 0.8;
            transition: all 0.3s ease;
        }

        .theme-switch {
            position: relative;
            width: 70px;
            height: 34px;
            cursor: pointer;
        }

        .theme-switch input {
            opacity: 0;
            width: 0;
            height: 0;
            position: absolute;
        }

        .slider {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--gradient-animated);
            background-size: 300% 300%;
            border-radius: 34px;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 
                0 4px 20px rgba(139, 115, 85, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            overflow: hidden;
            animation: gradientShift 8s ease infinite;
        }

        .slider::before {
            content: "";
            position: absolute;
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background: linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%);
            border-radius: 50%;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 
                0 3px 10px rgba(0, 0, 0, 0.3),
                inset -2px -2px 5px rgba(0, 0, 0, 0.2);
            z-index: 3;
        }

        .slider::after {
            content: '';
            position: absolute;
            inset: -2px;
            background: conic-gradient(
                from 0deg,
                transparent,
                var(--secondary),
                transparent 360deg
            );
            border-radius: 34px;
            opacity: 0;
            filter: blur(8px);
            z-index: -1;
            animation: btnRotate 3s linear infinite;
            transition: opacity 0.4s;
        }

        .slider:hover::after {
            opacity: 0.8;
        }

        .slider:hover {
            box-shadow: 
                0 6px 25px rgba(139, 115, 85, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .theme-icons {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 2;
        }

        .sun-icon, .moon-icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .sun-icon {
            left: 8px;
            opacity: 0;
            color: #FFD700;
            filter: drop-shadow(0 0 8px #FFD700);
        }

        .moon-icon {
            right: 8px;
            opacity: 1;
            color: #FFFFFF;
            filter: drop-shadow(0 0 8px #FFFFFF);
        }

        .theme-switch input:checked + .slider .sun-icon {
            opacity: 1;
            transform: translateY(-50%) scale(1.2);
        }

        .theme-switch input:checked + .slider .moon-icon {
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
        }

        .theme-switch input:checked + .slider::before {
            transform: translateX(36px);
            background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
            box-shadow: 
                0 3px 10px rgba(0, 0, 0, 0.5),
                inset -2px -2px 5px rgba(255, 255, 255, 0.1);
        }

        /* Main Content Wrapper */
        .main-content-wrapper {
            display: flex;
            flex: 1;
            overflow: hidden;
            position: relative;
        }

        /* Quick Actions Sidebar */
        .quick-actions-sidebar {
            width: 280px;
            background: rgba(26, 26, 26, 0.6);
            backdrop-filter: blur(20px);
            border-right: 1px solid rgba(139, 115, 85, 0.2);
            padding: 24px 16px;
            overflow-y: auto;
            flex-shrink: 0;
            transition: all 0.3s ease;
        }

        [data-theme="light"] .quick-actions-sidebar {
            background: rgba(255, 255, 255, 0.8);
        }

        .quick-actions-title {
            text-align: center;
            color: var(--text-secondary);
            margin-bottom: 20px;
            font-size: 0.9rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .actions-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .action-card {
            padding: 16px 14px;
            background: rgba(26, 26, 26, 0.6);
            backdrop-filter: blur(15px);
            border: 2px solid rgba(139, 115, 85, 0.2);
            border-radius: 14px;
            color: var(--text);
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 0.85rem;
            font-weight: 600;
            box-shadow: 
                0 4px 20px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
            position: relative;
            overflow: hidden;
        }

        [data-theme="light"] .action-card {
            background: rgba(255, 255, 255, 0.8);
        }

        .action-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--gradient);
            opacity: 0;
            transition: opacity 0.4s;
            z-index: 0;
        }

        .action-card::after {
            content: '';
            position: absolute;
            inset: -2px;
            background: conic-gradient(
                from 0deg,
                transparent,
                var(--secondary),
                transparent 360deg
            );
            border-radius: 14px;
            opacity: 0;
            filter: blur(10px);
            z-index: -1;
            animation: cardRotate 3s linear infinite;
            transition: opacity 0.4s;
        }

        .action-card:hover::before {
            opacity: 1;
        }

        .action-card:hover::after {
            opacity: 0.8;
        }

        .action-card > * {
            position: relative;
            z-index: 1;
        }

        .action-card:hover {
            transform: translateX(8px) scale(1.03);
            box-shadow: 
                0 12px 40px rgba(139, 115, 85, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            color: #FFFFFF;
            border-color: transparent;
        }

        .action-card svg {
            width: 22px;
            height: 22px;
            flex-shrink: 0;
        }

        .action-card:hover svg {
            animation: cardIconFloat 0.8s ease-in-out infinite;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
        }

        /* Chat Area - FULL WIDTH */
        .chat-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            width: 100%;
            overflow: hidden;
        }

        .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 24px 32px;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .message {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            animation: messageSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 75%;
        }

        .user-message {
            align-items: flex-end;
            align-self: flex-end;
        }

        .message-avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: var(--gradient-animated);
            background-size: 300% 300%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 
                0 4px 15px rgba(139, 115, 85, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            animation: 
                avatarPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                gradientShift 8s ease infinite;
            position: relative;
            overflow: hidden;
        }

        .message-avatar::before {
            content: '';
            position: absolute;
            inset: -100%;
            background: linear-gradient(
                45deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            animation: avatarShine 3s infinite;
        }

        .message-avatar svg {
            position: relative;
            z-index: 1;
            color: #FFFFFF;
        }

        .message-content {
            background: rgba(26, 26, 26, 0.6);
            backdrop-filter: blur(15px);
            padding: 16px 22px;
            border-radius: 18px;
            border: 1px solid rgba(139, 115, 85, 0.2);
            box-shadow: 
                0 8px 30px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            color: var(--text);
            line-height: 1.6;
            transition: all 0.3s ease;
            width: 100%;
        }

        [data-theme="light"] .message-content {
            background: rgba(255, 255, 255, 0.8);
            box-shadow: 
                0 8px 30px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        .message-content:hover {
            box-shadow: 
                0 12px 40px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
        }

        .user-message .message-content {
            background: var(--gradient-animated);
            background-size: 300% 300%;
            color: #FFFFFF;
            border-color: transparent;
            animation: gradientShift 8s ease infinite;
        }

        .message-actions {
            display: flex;
            gap: 10px;
            margin-top: 12px;
            flex-wrap: wrap;
        }

        .msg-action-btn {
            padding: 7px 14px;
            background: rgba(139, 115, 85, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(139, 115, 85, 0.3);
            border-radius: 10px;
            color: var(--text);
            cursor: pointer;
            font-size: 0.8rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            position: relative;
            overflow: hidden;
        }

        [data-theme="light"] .msg-action-btn {
            background: rgba(255, 255, 255, 0.6);
        }

        .msg-action-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: var(--gradient);
            opacity: 0;
            transition: opacity 0.4s;
            z-index: 0;
        }

        .msg-action-btn:hover::before {
            opacity: 1;
        }

        .msg-action-btn > * {
            position: relative;
            z-index: 1;
        }

        .msg-action-btn:hover {
            color: #FFFFFF;
            border-color: transparent;
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 8px 25px rgba(139, 115, 85, 0.4);
        }

        .message-time {
            font-size: 0.75rem;
            opacity: 0.7;
            display: flex;
            align-items: center;
            gap: 5px;
            color: var(--text-secondary);
        }

        /* Typing Indicator */
        .typing-indicator {
            display: flex;
            gap: 12px;
            align-items: flex-start;
            margin-bottom: 24px;
        }

        .typing-dots {
            background: rgba(26, 26, 26, 0.6);
            backdrop-filter: blur(15px);
            padding: 16px 22px;
            border-radius: 18px;
            border: 1px solid rgba(139, 115, 85, 0.2);
            display: flex;
            align-items: center;
            gap: 7px;
        }

        [data-theme="light"] .typing-dots {
            background: rgba(255, 255, 255, 0.8);
        }

        .dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: var(--secondary);
            animation: typingBounce 1.4s infinite ease-in-out;
            box-shadow: 0 0 10px var(--secondary);
        }

        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        /* Input Area */
        .input-area {
            padding: 20px 32px 24px 32px;
            position: relative;
            z-index: 2;
            flex-shrink: 0;
        }

        .input-container {
            display: flex;
            gap: 12px;
            align-items: flex-end;
        }

        #message-input {
            flex: 1;
            min-height: 58px;
            max-height: 130px;
            padding: 16px 22px;
            background: rgba(26, 26, 26, 0.6);
            backdrop-filter: blur(15px);
            border: 2px solid rgba(139, 115, 85, 0.2);
            border-radius: 18px;
            color: var(--text);
            font-size: 1rem;
            resize: none;
            outline: none;
            box-shadow: 
                0 4px 20px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            font-family: inherit;
            line-height: 1.5;
        }

        [data-theme="light"] #message-input {
            background: rgba(255, 255, 255, 0.8);
            box-shadow: 
                0 4px 20px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        #message-input:focus {
            border-color: var(--secondary);
            box-shadow: 
                0 8px 35px rgba(139, 115, 85, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }

        .send-button {
            width: 58px;
            height: 58px;
            background: var(--gradient-animated);
            background-size: 300% 300%;
            border: none;
            border-radius: 17px;
            color: #FFFFFF;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 
                0 8px 30px rgba(139, 115, 85, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            animation: gradientShift 8s ease infinite;
        }

        .send-button::before {
            content: '';
            position: absolute;
            inset: -100%;
            background: linear-gradient(
                45deg,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
            );
            animation: sendShine 3s infinite;
        }

        .send-button::after {
            content: '';
            position: absolute;
            inset: -2px;
            background: conic-gradient(
                from 0deg,
                transparent,
                var(--secondary),
                transparent 360deg
            );
            border-radius: 17px;
            opacity: 0;
            filter: blur(10px);
            z-index: -1;
            animation: sendRotate 3s linear infinite;
            transition: opacity 0.4s;
        }

        .send-button:hover::after {
            opacity: 1;
        }

        .send-button:hover {
            transform: translateY(-4px) scale(1.08);
            box-shadow: 
                0 15px 50px rgba(139, 115, 85, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .send-button svg {
            position: relative;
            z-index: 1;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
            transition: all 0.3s ease;
        }

        .send-button:hover svg {
            animation: sendPulse 0.6s ease infinite;
        }

        .send-button:active {
            transform: translateY(-2px) scale(1.04);
        }

        .input-hints {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 12px;
            font-size: 0.8rem;
            color: var(--text-secondary);
            opacity: 0.8;
        }

        /* Animations */
        @keyframes floatParticle {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
            25% { transform: translate(100px, -100px) rotate(90deg); opacity: 0.5; }
            50% { transform: translate(200px, 0) rotate(180deg); opacity: 0.3; }
            75% { transform: translate(100px, 100px) rotate(270deg); opacity: 0.5; }
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        @keyframes logoFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
        }

        @keyframes logoGlow {
            0%, 100% {
                box-shadow: 
                    0 0 60px rgba(139, 115, 85, 0.6),
                    0 0 100px rgba(139, 115, 85, 0.4),
                    inset 0 0 60px rgba(255, 255, 255, 0.1);
            }
            50% {
                box-shadow: 
                    0 0 80px rgba(139, 115, 85, 0.8),
                    0 0 140px rgba(139, 115, 85, 0.6),
                    inset 0 0 80px rgba(255, 255, 255, 0.15);
            }
        }

        @keyframes logoShine {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        @keyframes logoRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes iconPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes socialRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes sparkle {
            0%, 100% {
                opacity: 0;
                transform: scale(0);
            }
            50% {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes ctaRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes arrowBounce {
            0%, 100% { transform: translateX(10px); }
            50% { transform: translateX(15px); }
        }

        @keyframes glowPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }

        @keyframes starTwinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes headerLogoFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }

        @keyframes headerLogoShine {
            0% { transform: translateX(-200%) translateY(-200%) rotate(45deg); }
            100% { transform: translateX(200%) translateY(200%) rotate(45deg); }
        }

        @keyframes statusPulseGlow {
            0%, 100% { box-shadow: 0 0 20px var(--secondary); }
            50% { box-shadow: 0 0 30px var(--secondary); }
        }

        @keyframes btnRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes downloadBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }

        @keyframes deleteShake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-8deg); }
            75% { transform: rotate(8deg); }
        }

        @keyframes messageSlideIn {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes avatarPop {
            0% { transform: scale(0); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
        }

        @keyframes avatarShine {
            0% { transform: translateX(-200%) translateY(-200%) rotate(45deg); }
            100% { transform: translateX(200%) translateY(200%) rotate(45deg); }
        }

        @keyframes cardRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes cardIconFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-6px) rotate(5deg); }
        }

        @keyframes typingBounce {
            0%, 60%, 100% {
                transform: translateY(0) scale(0.8);
                opacity: 0.5;
                box-shadow: 0 0 10px var(--secondary);
            }
            30% {
                transform: translateY(-10px) scale(1);
                opacity: 1;
                box-shadow: 0 0 20px var(--secondary);
            }
        }

        @keyframes sendShine {
            0% { transform: translateX(-200%) translateY(-200%) rotate(45deg); }
            100% { transform: translateX(200%) translateY(200%) rotate(45deg); }
        }

        @keyframes sendRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes sendPulse {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.12) rotate(45deg); }
        }

        @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .quick-actions-sidebar {
                width: 240px;
            }
        }

        @media (max-width: 768px) {
            .quick-actions-sidebar {
                position: absolute;
                left: -280px;
                top: 0;
                bottom: 0;
                z-index: 5;
            }
            
            .quick-actions-sidebar.open {
                left: 0;
            }
            
            .chat-header { padding: 12px 16px; }
            .header-text h1 { font-size: 1.3rem; }
            .header-actions { gap: 10px; }
            .header-action-btn { padding: 8px 14px; font-size: 0.8rem; }
            .icon-btn { width: 45px; height: 45px; }
            .theme-switch { width: 60px; height: 28px; }
            .slider::before { width: 20px; height: 20px; }
            .message { max-width: 90%; }
            .input-area { padding: 16px 16px 20px 16px; }
            #message-input { padding: 14px 18px; font-size: 0.95rem; }
            .send-button { width: 50px; height: 50px; }
            .messages-container { padding: 20px 16px; }
        }

        /* Scrollbar */
        .messages-container::-webkit-scrollbar,
        .quick-actions-sidebar::-webkit-scrollbar {
            width: 6px;
        }

        .messages-container::-webkit-scrollbar-track,
        .quick-actions-sidebar::-webkit-scrollbar-track {
            background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb,
        .quick-actions-sidebar::-webkit-scrollbar-thumb {
            background: var(--secondary);
            border-radius: 3px;
            box-shadow: 0 0 10px var(--secondary);
        }

        .messages-container::-webkit-scrollbar-thumb:hover,
        .quick-actions-sidebar::-webkit-scrollbar-thumb:hover {
            background: var(--primary);
            box-shadow: 0 0 15px var(--primary);
        }

        .cursor {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    </style>
</head>
<body>
    <div class="particles-bg" id="particles-bg"></div>

    <div id="app">
        <!-- Welcome Screen -->
        <div id="welcome-screen" class="welcome-screen">
            <div class="welcome-overlay"></div>
            
            <div class="welcome-content">
                <div class="logo-container">
                    <div class="logo">
                        <i data-lucide="code" class="logo-icon"></i>
                    </div>
                </div>

                <h1 class="welcome-title">
                    <span id="typing-text">CS Assistant</span>
                </h1>

                <p class="welcome-description" id="welcome-description">
                    Your intelligent Computer Science companion with a clean, minimalist design
                </p>

                <div class="social-container" id="social-container">
                    <a href="https://github.com/the-lazyguy" target="_blank" rel="noopener noreferrer" class="modern-social-btn github">
                        <div class="icon">
                            <i data-lucide="github"></i>
                        </div>
                        <span>GitHub</span>
                    </a>
                    
                    <a href="https://www.linkedin.com/in/zain-nadeem-917524177/" target="_blank" rel="noopener noreferrer" class="modern-social-btn linkedin">
                        <div class="icon">
                            <i data-lucide="linkedin"></i>
                        </div>
                        <span>LinkedIn</span>
                    </a>
                </div>

                <button id="start-button" class="cta-button">
                    <div class="cta-glow"></div>
                    <div class="cta-sparkle"></div>
                    <div class="cta-sparkle"></div>
                    <div class="cta-sparkle"></div>
                    <div class="cta-button-inner">
                        <div class="cta-text">
                            <span>Begin Journey</span>
                            <div class="cta-arrow">
                                <svg width="20" height="14" viewBox="0 0 13 10" fill="none" stroke="currentColor">
                                    <path d="M1,5 L11,5"></path>
                                    <polyline points="8 1 12 5 8 9"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <!-- Chat Interface -->
        <div id="chat-interface" class="chat-interface hidden">
            <div class="chat-header">
                <div class="header-left">
                    <div class="header-logo">
                        <i data-lucide="code" class="header-icon"></i>
                    </div>
                    <div class="header-text">
                        <h1>CS Assistant</h1>
                        <div class="status">
                            <div class="status-dot"></div>
                            Online • Ready to explore
                        </div>
                    </div>
                </div>
                
                <div class="header-actions">
                    <button id="bulk-copy-btn" class="header-action-btn">
                        <i data-lucide="copy"></i>
                        <span>Copy Chat</span>
                    </button>
                    
                    <div class="theme-switch-wrapper">
                        <span class="theme-switch-label">Theme</span>
                        <label class="theme-switch">
                            <input type="checkbox" id="theme-toggle">
                            <span class="slider">
                                <div class="theme-icons">
                                    <i data-lucide="sun" class="sun-icon"></i>
                                    <i data-lucide="moon" class="moon-icon"></i>
                                </div>
                            </span>
                        </label>
                    </div>
                    
                    <button id="download-btn" class="icon-btn download-btn" title="Download Chat">
                        <i data-lucide="download"></i>
                    </button>
                    <button id="delete-btn" class="icon-btn delete-btn" title="Clear Chat">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>

            <div class="main-content-wrapper">
                <!-- Quick Actions Sidebar -->
                <div class="quick-actions-sidebar" id="quick-actions-sidebar">
                    <div class="quick-actions-title">Quick Topics</div>
                    <div class="actions-list">
                        <button class="action-card" data-prompt="Explain time complexity and space complexity with examples">
                            <i data-lucide="cpu"></i>
                            <span>Algorithms</span>
                        </button>
                        <button class="action-card" data-prompt="Compare arrays vs linked lists and their use cases">
                            <i data-lucide="database"></i>
                            <span>Data Structures</span>
                        </button>
                        <button class="action-card" data-prompt="What are the benefits of cloud computing for developers?">
                            <i data-lucide="cloud"></i>
                            <span>Cloud Computing</span>
                        </button>
                        <button class="action-card" data-prompt="Explain common web security vulnerabilities and prevention">
                            <i data-lucide="shield"></i>
                            <span>Cybersecurity</span>
                        </button>
                        <button class="action-card" data-prompt="What is machine learning and how does it differ from traditional programming?">
                            <i data-lucide="zap"></i>
                            <span>AI/ML</span>
                        </button>
                        <button class="action-card" data-prompt="Tell me about the frontend development of this application">
                            <i data-lucide="code"></i>
                            <span>Web Dev</span>
                        </button>
                    </div>
                </div>

                <!-- Chat Area -->
                <div class="chat-area">
                    <div class="messages-container" id="messages-container">
                        <div class="message bot-message">
                            <div class="message-avatar">
                                <i data-lucide="bot"></i>
                            </div>
                            <div class="message-content">
                                Hello! I'm your CS Assistant. I can help you navigate through:<br><br>
                                • Algorithms & Data Structures<br>
                                • Programming Languages & Concepts<br>
                                • System Design & Architecture<br>
                                • Cloud Computing & DevOps<br>
                                • AI/ML & Data Science<br>
                                • Cybersecurity & Best Practices<br><br>
                                What topic would you like to explore today?
                                <div class="message-actions">
                                    <button class="msg-action-btn">
                                        <i data-lucide="copy"></i>
                                        <span>Copy</span>
                                    </button>
                                    <button class="msg-action-btn">
                                        <i data-lucide="thumbs-up"></i>
                                        <span>Helpful</span>
                                    </button>
                                    <button class="msg-action-btn">
                                        <i data-lucide="thumbs-down"></i>
                                        <span>Not Helpful</span>
                                    </button>
                                </div>
                            </div>
                            <div class="message-time">
                                <i data-lucide="clock"></i>
                                <span class="timestamp">''' + datetime.now().strftime("%H:%M") + '''</span>
                            </div>
                        </div>
                    </div>

                    <div class="typing-indicator hidden" id="typing-indicator">
                        <div class="message-avatar">
                            <i data-lucide="bot"></i>
                        </div>
                        <div class="typing-dots">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                    </div>

                    <div class="input-area">
                        <div class="input-container">
                            <textarea 
                                id="message-input" 
                                placeholder="Ask me anything about Computer Science..."
                                rows="1"
                            ></textarea>
                            <button id="send-button" class="send-button">
                                <i data-lucide="send"></i>
                            </button>
                        </div>
                        <div class="input-hints">
                            <span>Press Enter to send</span>
                            <span>•</span>
                            <span>Shift+Enter for new line</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        lucide.createIcons();

        let currentTheme = 'dark';
        let chatHistory = [];

        const welcomeScreen = document.getElementById('welcome-screen');
        const chatInterface = document.getElementById('chat-interface');
        const startButton = document.getElementById('start-button');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const messagesContainer = document.getElementById('messages-container');
        const typingIndicator = document.getElementById('typing-indicator');
        const themeToggle = document.getElementById('theme-toggle');
        const deleteButton = document.getElementById('delete-btn');
        const bulkCopyButton = document.getElementById('bulk-copy-btn');
        const downloadButton = document.getElementById('download-btn');
        const actionCards = document.querySelectorAll('.action-card');
        const particlesBg = document.getElementById('particles-bg');

        function createParticles() {
            // Clear existing particles
            particlesBg.innerHTML = '';
            
            for (let i = 0; i < 25; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.width = Math.random() * 4 + 2 + 'px';
                particle.style.height = particle.style.width;
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
                particle.style.animationDelay = Math.random() * 5 + 's';
                particle.style.opacity = Math.random() * 0.4 + 0.1;
                particlesBg.appendChild(particle);
            }
        }

        function init() {
            setupEventListeners();
            initializeWelcomeScreen();
            createParticles();
            loadTheme();
            loadChatHistory();
        }

        function setupEventListeners() {
            startButton.addEventListener('click', startChat);
            sendButton.addEventListener('click', sendMessage);
            messageInput.addEventListener('keydown', handleInputKeydown);
            themeToggle.addEventListener('change', toggleTheme);
            deleteButton.addEventListener('click', clearChat);
            bulkCopyButton.addEventListener('click', copyChatHistory);
            downloadButton.addEventListener('click', downloadChat);
            
            actionCards.forEach(card => {
                card.addEventListener('click', () => {
                    const prompt = card.getAttribute('data-prompt');
                    messageInput.value = prompt;
                    sendMessage();
                });
            });

            // Recreate particles on resize for better distribution
            window.addEventListener('resize', createParticles);
        }

        function initializeWelcomeScreen() {
            const typingText = document.getElementById('typing-text');
            const welcomeDescription = document.getElementById('welcome-description');
            const socialContainer = document.getElementById('social-container');

            typeWriter(typingText, "CS Assistant", 0, () => {
                setTimeout(() => {
                    welcomeDescription.style.opacity = '1';
                    setTimeout(() => {
                        socialContainer.style.opacity = '1';
                        setTimeout(() => {
                            startButton.style.opacity = '1';
                        }, 500);
                    }, 500);
                }, 500);
            });
        }

        function typeWriter(element, text, index, callback) {
            if (index < text.length) {
                element.innerHTML = text.substring(0, index + 1) + '<span class="cursor">|</span>';
                setTimeout(() => typeWriter(element, text, index + 1, callback), 100);
            } else {
                element.innerHTML = text;
                if (callback) callback();
            }
        }

        function startChat() {
            welcomeScreen.style.opacity = '0';
            setTimeout(() => {
                welcomeScreen.classList.add('hidden');
                chatInterface.classList.remove('hidden');
                messageInput.focus();
                
                chatInterface.style.opacity = '0';
                chatInterface.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    chatInterface.style.opacity = '1';
                    chatInterface.style.transform = 'translateY(0)';
                    chatInterface.style.transition = 'all 0.5s ease';
                }, 100);
            }, 500);
        }

        function handleInputKeydown(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
            
            setTimeout(() => {
                messageInput.style.height = 'auto';
                messageInput.style.height = Math.min(messageInput.scrollHeight, 130) + 'px';
            }, 0);
        }

        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
            showTypingIndicator();
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });
                
                const data = await response.json();
                hideTypingIndicator();
                addMessage(data.response, 'bot');
                
            } catch (error) {
                hideTypingIndicator();
                addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                console.error('Error:', error);
            }
        }

        function addMessage(content, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i data-lucide="${sender === 'user' ? 'user' : 'bot'}"></i>
                </div>
                <div class="message-content">${formatMessage(content)}</div>
                <div class="message-time">
                    <i data-lucide="clock"></i>
                    <span class="timestamp">${timestamp}</span>
                </div>
            `;
            
            messagesContainer.appendChild(messageDiv);
            scrollToBottom();
            
            if (sender === 'bot') {
                addMessageActions(messageDiv);
            }
            
            chatHistory.push({ content, sender, timestamp: new Date().toISOString() });
            saveChatHistory();
            
            lucide.createIcons();
        }

        function formatMessage(content) {
            return content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/- (.*?)(?=\\n|$)/g, '• $1<br>')
                .replace(/\\n/g, '<br>');
        }

        function addMessageActions(messageDiv) {
            const messageContent = messageDiv.querySelector('.message-content');
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';
            
            actionsDiv.innerHTML = `
                <button class="msg-action-btn copy-btn">
                    <i data-lucide="copy"></i>
                    <span>Copy</span>
                </button>
                <button class="msg-action-btn feedback-btn">
                    <i data-lucide="thumbs-up"></i>
                    <span>Helpful</span>
                </button>
                <button class="msg-action-btn feedback-btn">
                    <i data-lucide="thumbs-down"></i>
                    <span>Not Helpful</span>
                </button>
            `;
            
            messageContent.appendChild(actionsDiv);
            
            const copyBtn = actionsDiv.querySelector('.copy-btn');
            const feedbackBtns = actionsDiv.querySelectorAll('.feedback-btn');
            
            copyBtn.addEventListener('click', () => {
                const textToCopy = messageContent.textContent.replace(/CopyHelpfulNot Helpful/g, '').trim();
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const icon = copyBtn.querySelector('i');
                    const span = copyBtn.querySelector('span');
                    icon.setAttribute('data-lucide', 'check');
                    span.textContent = 'Copied!';
                    lucide.createIcons();
                    setTimeout(() => {
                        icon.setAttribute('data-lucide', 'copy');
                        span.textContent = 'Copy';
                        lucide.createIcons();
                    }, 2000);
                });
            });
            
            feedbackBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const wasHelpful = btn.querySelector('i').getAttribute('data-lucide') === 'thumbs-up';
                    showFeedback(wasHelpful);
                });
            });

            lucide.createIcons();
        }

        function showTypingIndicator() {
            typingIndicator.classList.remove('hidden');
            scrollToBottom();
        }

        function hideTypingIndicator() {
            typingIndicator.classList.add('hidden');
        }

        function scrollToBottom() {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }

        function loadTheme() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            setTheme(savedTheme);
            themeToggle.checked = savedTheme === 'light';
            
            // Update icons based on theme
            updateThemeIcons(savedTheme);
        }

        function toggleTheme() {
            const newTheme = themeToggle.checked ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        }

        function setTheme(theme) {
            currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
        }

        function updateThemeIcons(theme) {
            const sunIcon = document.querySelector('.sun-icon');
            const moonIcon = document.querySelector('.moon-icon');
            
            if (theme === 'light') {
                sunIcon.style.opacity = '1';
                sunIcon.style.transform = 'translateY(-50%) scale(1.2)';
                moonIcon.style.opacity = '0';
                moonIcon.style.transform = 'translateY(-50%) scale(0.8)';
            } else {
                sunIcon.style.opacity = '0';
                sunIcon.style.transform = 'translateY(-50%) scale(0.8)';
                moonIcon.style.opacity = '1';
                moonIcon.style.transform = 'translateY(-50%) scale(1.2)';
            }
        }

        function loadChatHistory() {
            const saved = localStorage.getItem('chatHistory');
            if (saved) {
                chatHistory = JSON.parse(saved);
            }
        }

        function saveChatHistory() {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }

        function clearChat() {
            if (confirm('Are you sure you want to clear the chat history?')) {
                messagesContainer.innerHTML = `
                    <div class="message bot-message">
                        <div class="message-avatar">
                            <i data-lucide="bot"></i>
                        </div>
                        <div class="message-content">
                            Chat cleared! Ready to explore new CS topics.
                            <div class="message-actions">
                                <button class="msg-action-btn">
                                    <i data-lucide="copy"></i>
                                    <span>Copy</span>
                                </button>
                            </div>
                        </div>
                        <div class="message-time">
                            <i data-lucide="clock"></i>
                            <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                `;
                
                chatHistory = [];
                saveChatHistory();
                lucide.createIcons();
            }
        }

        function copyChatHistory() {
            const chatText = chatHistory.map(msg => 
                `${msg.sender === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
            ).join('\\n\\n');
            
            navigator.clipboard.writeText(chatText).then(() => {
                const icon = bulkCopyButton.querySelector('i');
                const span = bulkCopyButton.querySelector('span');
                const originalIcon = icon.getAttribute('data-lucide');
                const originalText = span.textContent;
                
                icon.setAttribute('data-lucide', 'check');
                span.textContent = 'Copied!';
                lucide.createIcons();
                
                setTimeout(() => {
                    icon.setAttribute('data-lucide', originalIcon);
                    span.textContent = originalText;
                    lucide.createIcons();
                }, 2000);
            });
        }

        function downloadChat() {
            const chatText = chatHistory.map(msg => 
                `${msg.sender === 'user' ? 'You' : 'Assistant'} (${msg.timestamp}): ${msg.content}`
            ).join('\\n\\n');
            
            const blob = new Blob([chatText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cs-assistant-chat-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function showFeedback(wasHelpful) {
            const feedback = document.createElement('div');
            feedback.textContent = wasHelpful ? 'Thanks for your feedback! 👍' : 'Sorry to hear that. I\\'ll try to improve! 👎';
            feedback.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${wasHelpful ? '#4CAF50' : '#f44336'};
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                z-index: 1000;
                animation: slideInRight 0.4s ease;
                font-weight: 600;
            `;
            
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.style.animation = 'slideOutRight 0.4s ease';
                setTimeout(() => {
                    document.body.removeChild(feedback);
                }, 400);
            }, 3000);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.addEventListener('DOMContentLoaded', init);
    </script>
</body>
</html>
'''

@app.route('/')
def index():
    return HTML_TEMPLATE

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