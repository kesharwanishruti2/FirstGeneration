export const lessonsData = [
  {
    id: "1",
    number: "01",
    title: "What is the Internet?",
    description: "Understand what the internet is and how devices connect together.",
    quizId: "internet-basics",
    subtitle: "The internet is a vast global network connecting billions of computers, phones, and devices worldwide.",
    analogy: "Think of the internet like an invisible global highway system. Instead of cars, tiny packets of information travel between computers at nearly the speed of light.",
    keyPoints: [
      "Connects billions of devices worldwide via cables, Wi-Fi, and satellites.",
      "Allows instant communication, text messages, phone calls, and emails.",
      "Powers websites, online videos, maps, digital banking, and apps.",
      "No single person or company owns the entire internet."
    ],
    details: [
      {
        heading: "How devices talk to each other",
        body: "When you send a message or open a website, your device asks another computer (called a server) for information. That server sends the data back across the internet to your screen."
      },
      {
        heading: "Wi-Fi vs Cellular Data",
        body: "You can connect to the internet through Wi-Fi (a wireless signal usually inside homes or offices) or mobile data (signals from cell phone towers when you are on the move)."
      }
    ]
  },
  {
    id: "2",
    number: "02",
    title: "Web Browsers",
    description: "Learn how browsers help you access websites and navigate the web.",
    quizId: "web-browsers",
    subtitle: "A web browser is the software application you use to visit websites and view pages on the internet.",
    analogy: "If the internet is a massive ocean of information, your web browser is your windowed submarine that lets you safely visit and view every corner of it.",
    keyPoints: [
      "Common browsers include Google Chrome, Apple Safari, Microsoft Edge, and Mozilla Firefox.",
      "The Address Bar (URL bar) is where you type website links like google.com or wikipedia.org.",
      "Tabs allow you to keep multiple web pages open at the same time.",
      "Bookmarks (or Favorites) let you save websites you want to visit again later."
    ],
    details: [
      {
        heading: "What is a URL?",
        body: "URL stands for Uniform Resource Locator — it's simply a website's unique address, like a house address. For example, https://www.google.com directs your browser straight to Google."
      },
      {
        heading: "Navigation Buttons",
        body: "The 'Back' (←) arrow returns to the previous page you visited, and 'Refresh' (⟳) reloads the page to get the freshest content."
      }
    ]
  },
  {
    id: "3",
    number: "03",
    title: "Search Engines",
    description: "Find useful information, answers, and news online with confidence.",
    quizId: "search-engines",
    subtitle: "A search engine searches billions of web pages to find answers, guides, recipes, and videos in a fraction of a second.",
    analogy: "Imagine an ultra-fast librarian who has memorized every book in the world's biggest library and hands you the top 10 relevant pages the second you ask.",
    keyPoints: [
      "Google is the world's most popular search engine, along with Microsoft Bing and DuckDuckGo.",
      "Type simple keywords (like 'weather today' or 'how to bake cookies') instead of full sentences.",
      "Search results show page titles and short snippets so you can pick the best link.",
      "Always verify information with trustworthy, established sources."
    ],
    details: [
      {
        heading: "Tips for Better Searching",
        body: "Use specific words. For example, instead of searching 'food', try 'easy 15-minute pasta recipe'. If you want images or videos, click the 'Images' or 'Videos' tabs at the top."
      },
      {
        heading: "Sponsored vs Organic Results",
        body: "Search engines often show ads at the very top marked with 'Sponsored'. Real informational results appear directly below the sponsored listings."
      }
    ]
  },
  {
    id: "4",
    number: "04",
    title: "Online Safety",
    description: "Stay safe, protect passwords, and spot scams while browsing.",
    quizId: "online-safety",
    subtitle: "Simple, essential safety habits to protect your identity, personal information, and peace of mind online.",
    analogy: "Just like locking your front door before going out, online safety means securing your accounts so unwanted strangers cannot access your private life.",
    keyPoints: [
      "Create strong, unique passwords that mix uppercase letters, numbers, and symbols.",
      "Never share OTPs (One Time Passwords) or banking credentials with anyone over calls or texts.",
      "Look for the padlock symbol (🔒) and 'https://' in the browser address bar for encrypted connections.",
      "Never click suspicious links or download unexpected attachments from unknown senders."
    ],
    details: [
      {
        heading: "Spotting Phishing & Scams",
        body: "Scammers often create fake messages pretending to be your bank or courier service, creating artificial urgency ('Your account will be blocked!'). Legitimate companies never ask for your password or PIN."
      },
      {
        heading: "Safe Public Wi-Fi Habits",
        body: "When using free Wi-Fi in cafes or airports, avoid logging into sensitive bank accounts, as public networks are less secure than your private home Wi-Fi."
      }
    ]
  }
];

export const quizzesData = {
  "internet-basics": {
    lessonId: "1",
    title: "Internet Basics Quiz",
    lessonTitle: "What is the Internet?",
    nextLessonId: "2",
    questions: [
      {
        question: "What is the Internet primarily?",
        options: [
          "A single giant computer owned by one government",
          "A global network that connects computers and devices worldwide",
          "An offline mobile application",
          "A cable that only works in schools"
        ],
        answer: 1,
        explanation: "The internet is a global decentralized network connecting billions of computers and devices across the world."
      },
      {
        question: "Which of the following devices can connect to the internet?",
        options: [
          "Smartphone",
          "Laptop",
          "Tablet",
          "All of the above"
        ],
        answer: 3,
        explanation: "All modern smart devices including phones, laptops, tablets, and smart TVs can connect to the internet."
      },
      {
        question: "What connects your phone to the internet when you are away from home Wi-Fi?",
        options: [
          "Mobile cellular data (4G/5G)",
          "FM Radio waves only",
          "A paper map",
          "Bluetooth without internet"
        ],
        answer: 0,
        explanation: "Mobile cellular data (4G/5G) uses cellular towers to provide internet wherever you travel."
      },
      {
        question: "Does one single company own the entire internet?",
        options: [
          "Yes, Google owns all of it",
          "Yes, Microsoft owns all of it",
          "No, the internet is a decentralized network of many networks",
          "Yes, your internet service provider owns it"
        ],
        answer: 2,
        explanation: "No single company or government owns the internet; it is a collaborative network linking many providers worldwide."
      },
      {
        question: "Which of these is made possible by the internet?",
        options: [
          "Sending instant emails across countries",
          "Watching educational videos online",
          "Video calling family anywhere in the world",
          "All of these"
        ],
        answer: 3,
        explanation: "The internet powers emails, video calls, media streaming, web browsing, and instant worldwide communication."
      }
    ]
  },
  "web-browsers": {
    lessonId: "2",
    title: "Web Browsers Quiz",
    lessonTitle: "Web Browsers",
    nextLessonId: "3",
    questions: [
      {
        question: "What is the main purpose of a web browser?",
        options: [
          "To visit websites and view web pages",
          "To clean dust from your computer screen",
          "To manufacture computer chips",
          "To play audio CDs offline"
        ],
        answer: 0,
        explanation: "A web browser is software designed specifically to navigate and display pages on the World Wide Web."
      },
      {
        question: "Which of the following is a web browser?",
        options: [
          "Google Chrome",
          "Microsoft Word",
          "Calculator",
          "Photoshop"
        ],
        answer: 0,
        explanation: "Google Chrome is a web browser. Word, Calculator, and Photoshop are standalone desktop programs."
      },
      {
        question: "Where do you type a website address like 'google.com'?",
        options: [
          "In the Address Bar (URL bar)",
          "In the recycling bin",
          "In the volume control",
          "In the computer settings wallpaper"
        ],
        answer: 0,
        explanation: "The Address Bar (at the top of your browser window) is where you type web addresses (URLs)."
      },
      {
        question: "What do browser 'Tabs' allow you to do?",
        options: [
          "Turn off your computer instantly",
          "Keep multiple web pages open at the same time",
          "Delete your internet connection",
          "Increase the screen brightness"
        ],
        answer: 1,
        explanation: "Tabs let you view and switch between multiple websites without closing your current window."
      },
      {
        question: "What does the 'Back' arrow button do in a browser?",
        options: [
          "Closes the computer",
          "Takes you back to the previous page you were viewing",
          "Erases your search history permanently",
          "Sends an email"
        ],
        answer: 1,
        explanation: "Clicking the Back arrow (←) immediately loads the previous web page you were looking at."
      }
    ]
  },
  "search-engines": {
    lessonId: "3",
    title: "Search Engines Quiz",
    lessonTitle: "Search Engines",
    nextLessonId: "4",
    questions: [
      {
        question: "What does a search engine do?",
        options: [
          "Scans web pages to find information matching your search keywords",
          "Repairs broken phone screens",
          "Prints physical papers automatically",
          "Turns on your kitchen appliances"
        ],
        answer: 0,
        explanation: "Search engines index billions of web pages and return the most relevant pages matching your keywords."
      },
      {
        question: "Which of the following is a well-known search engine?",
        options: [
          "Google",
          "Adobe Acrobat Reader",
          "Notepad",
          "Media Player"
        ],
        answer: 0,
        explanation: "Google is the world's most popular search engine, helping billions of people find information daily."
      },
      {
        question: "What should you type into a search engine to get better answers?",
        options: [
          "A random string of numbers",
          "Clear, specific keywords about what you want to find",
          "Your credit card PIN",
          "An empty space"
        ],
        answer: 1,
        explanation: "Clear, specific keywords (like 'chocolate cake recipe' or 'weather in Delhi') help search engines pinpoint exact answers."
      },
      {
        question: "What do 'Sponsored' labels in search results mean?",
        options: [
          "They are government laws",
          "They are paid advertisements",
          "They are broken websites",
          "They are official computer viruses"
        ],
        answer: 1,
        explanation: "'Sponsored' means a business paid to promote their link at the top of search results."
      },
      {
        question: "If you want to find photos of something, which tab can you click on Google?",
        options: [
          "Files",
          "Images",
          "Power Off",
          "Print"
        ],
        answer: 1,
        explanation: "Clicking the 'Images' tab filters your search results to display pictures and diagrams."
      }
    ]
  },
  "online-safety": {
    lessonId: "4",
    title: "Online Safety Quiz",
    lessonTitle: "Online Safety",
    nextLessonId: null,
    questions: [
      {
        question: "Which password is the safest to use?",
        options: [
          "123456",
          "password",
          "myname2024",
          "Tr#8vP!9m$Lq (a mix of upper/lowercase, numbers, and symbols)"
        ],
        answer: 3,
        explanation: "Strong passwords combine uppercase letters, lowercase letters, numbers, and special symbols so hackers cannot guess them."
      },
      {
        question: "Should you ever share your banking OTP with someone calling on the phone?",
        options: [
          "Yes, if they say they work at the bank",
          "No, never! Banks and real companies never ask for your OTP",
          "Yes, if they promise a prize",
          "Yes, anytime anyone asks"
        ],
        answer: 1,
        explanation: "Never share OTPs (One-Time Passwords). Real bank staff will NEVER ask for your OTP or password over phone calls."
      },
      {
        question: "What does the padlock icon 🔒 in the browser address bar indicate?",
        options: [
          "The website is locked and cannot be opened",
          "Your connection to that website is encrypted and secure (HTTPS)",
          "Your computer is out of memory",
          "The website has expired"
        ],
        answer: 1,
        explanation: "The padlock icon indicates that your communication with that website is encrypted via HTTPS, protecting passwords and data."
      },
      {
        question: "What should you do if you receive an unexpected email saying you won a lottery you never entered?",
        options: [
          "Click the link and send them money immediately",
          "Do not click the link, mark it as spam or delete it",
          "Forward your credit card details to check",
          "Send it to all your contacts"
        ],
        answer: 1,
        explanation: "Unexpected lottery wins are classic phishing scams designed to steal your money or credentials. Delete them safely."
      },
      {
        question: "Is it safe to do online banking on public unsecured cafe Wi-Fi?",
        options: [
          "It is best to avoid sensitive banking on public Wi-Fi or use mobile data instead",
          "Yes, public Wi-Fi is safer than home internet",
          "Yes, because anyone nearby can help you",
          "There is no difference at all"
        ],
        answer: 0,
        explanation: "Public Wi-Fi networks can be intercepted by bad actors. Always use secure home Wi-Fi or cellular mobile data for banking."
      }
    ]
  }
};
