# DigiAI Course

*DigiAI Course* 
An online learning platform that utilizes the latest technology, including Gemini-based AI, and allows participants to earn official certification. The project is built on *Internet Computer Protocol (ICP)*, offering a modern learning experience with blockchain integration.

*Video Demonstration*: [https://www.loom.com/share/3510f9165fe74fce93ba5aebadcd61a0?sid=6ab70420-243e-4b0e-8d37-6a56569b0e4d](https://www.loom.com/share/3510f9165fe74fce93ba5aebadcd61a0?sid=6ab70420-243e-4b0e-8d37-6a56569b0e4d)

---

## Features

### 👨‍🎓 For Course Participants  
- *Self-Learning*: Access interactive lesson materials designed to enhance deep understanding.
- *AI Summarize*: AI features powered by Gemini provide analogies or additional explanations to aid comprehension.
- *Ceritfications*: Obtain official certificates upon completion of specific courses.
- *Learning Community:*: Interact with other participants to share insights and experiences.

### 👨‍🏫 For Instructors  
- *Course Management*: Create and manage learning materials with an easy-to-use interface.
- *Course Monetization*: Set access fees for premium content.
- *Statistics Dashboard*: Monitor course progress, participant numbers, and earnings in real-time.

## 💻 Technology Stack  

### Core ICP Technologies  
- *Internet Computer Protocol (ICP)* 
- *Motoko*
- *ICP Ledger*
- *Internet Identity*

### Frontend Technologies 
- *React.js*
- *Vite* 
- *Typescript*
- *Redux*
- *Tailwind*
- *Lucide Dev*

### IPFS Provider
- *Pinata Web3*

### AI Tools
- *Gemini*

---

## 🛠️ Prerequisites

Ensure you have the following installed:

- *DFX (Dfinity SDK)* - [Installation Guide](https://internetcomputer.org/docs/current/developer-docs/getting-started/install)
- *Node.js* (Latest LTS version) - [Download](https://nodejs.org/)
- *Pinata Account* - [Sign Up](https://pinata.cloud/)
- *Motoko Programming Language Guidet* - [Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- *SDK Developer Tools* - [Guide](https://internetcomputer.org/docs/current/developer-docs/setup/install)

## 🚀 Installation

1. Clone the repository:
   bash
   git clone https://github.com/aldoprogrammer/digiAI-course.git
   cd digiai-course
   

2. Install project dependencies:
   bash
   npm install
   

## 🔐 Environment Setup

### Pinata Configuration

1. Log in to [Pinata](https://pinata.cloud/)
2. Navigate to *API Keys*
3. Create a new API key:
   - Provide a descriptive name
   - Set appropriate permissions
4. Copy the generated *JWT Token*
5. Go to *Gateways* and note your domain

### Environment Variables

Create a .env file in the digiai_frontend directory:

bash
VITE_PINATA_JWT=<your-pinata-jwt>
VITE_GATEWAY_URL=<your-pinata-domain>


## 💻 Local Development

1. Start the Internet Computer Local Network:
   bash
   dfx start --clean --background
   

2. Deploy the ICP Ledger:
   bash
   npm run deploy-ledger
   # Alternative: Follow instructions in deploy_icp_ledger.sh
   

3. Deploy project canisters:
   bash
   dfx deploy
   

4. Launch development server:
   bash
   npm start
   
---

## 📅 Future Plans  

We’re excited to keep improving DigiAI! Here’s what’s in store for future updates:  

1. *Design and User Experience Enhancement*  
   - Improve the interface and user flow for better intuitiveness.

2. *Advanced Certification Features*  
   - Digital certificates verified on the blockchain.

3. *Leaderboard with Rewards*  
   - Add a leaderboard for participants with the best contributions, complete with NFTs as rewards. 

4. *Further AI Integration*  
   - Enhance AI capabilities to provide a more personalized learning experience.

## 📧 Contact Information
If any questions occured, or in the need of any discussion or details,
please contact us :
- Email : marvelmichael67@gmail.com
- Discord : marpeyyy_58295
- Email: aldobesma@gmail.com
- Discord : aldols