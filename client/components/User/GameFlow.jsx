import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Mic, MicOff, Send } from "lucide-react";
import { AI_SERVER_URL } from "@/constants/utils";

const sampleInputs = [
  {
    title: "Conservative Investor",
    text: "",
  },
  {
    title: "Balanced Growth",
    text: "I want to invest 10 lakhs based on the risk give me different assets classes",
  },
  {
    title: "Aggressive Growth",
    text: "I'm seeking high returns and can take high risks. I want to invest ₹1 lakh for 7-10 years in growth-oriented instruments. Market volatility doesn't worry me.",
  },
  {
    title: "Example Prompt 1",
    text: "I am a 30-year-old investor with a moderate risk tolerance. My primary goal is to achieve long-term financial stability while maximizing returns through a balanced investment strategy. I am comfortable with a mix of equities, bonds, and alternative assets. I prefer a diversified portfolio that includes technology stocks, real estate investments, and index funds. Additionally, I am open to sustainable and ESG-friendly investments. My ideal investment horizon is 10-15 years, and I would like to see a projected return of at least 8-12% annually. Please generate an optimal investment pathway based on these preferences, ensuring proper risk management and diversification",
  },
  {
    title: "Example Prompt 2",
    text: "As a financial firm seeking an optimized investment pathway, we require a comprehensive allocation strategy that maximizes returns while balancing risk across diverse asset classes. Our portfolio should be segmented into equities (large-cap, mid-cap, small-cap, emerging markets, and sector-specific stocks like technology, healthcare, energy, and consumer goods), fixed income (government bonds, corporate bonds, municipal bonds, and inflation-protected securities), alternative investments (real estate, commodities, hedge funds, and private equity), and sustainable investments (ESG-compliant funds, green bonds, and impact investing). We also require a detailed breakdown of liquidity management, risk-adjusted returns, and tax-efficient strategies for each segment. Please generate a highly detailed, data-driven investment roadmap, ensuring diversification, volatility control, and sector-wise allocation for both short-term (1-3 years), mid-term (3-7 years), and long-term (7+ years) horizons.",
  },
];

const GameFlow = () => {
  const [activeTab, setActiveTab] = useState("conservative");
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const textareaRef = useRef(null);
  const [serverData, setServerData] = useState(null);
  const flowchartRef = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSpeechToText = () => {
    if (!isListening) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setUserInput(transcript);
          if (textareaRef.current) {
            textareaRef.current.value = transcript;
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } else {
        alert("Speech recognition is not supported in your browser.");
      }
    } else {
      setIsListening(false);
      window.speechSynthesis.cancel();
    }
  };

  const handleStrategySelect = (strategy) => {
    setActiveTab(strategy);
  };

  const handleGenerate = async () => {
    if (!activeTab) return;

    setIsGenerating(true);
    setShowFlowchart(false);

    try {
      const formData = new FormData();
      formData.append(
        "input",
        userInput ||
          `I am an investor looking for financial guidance. My primary objective is to optimize my investment strategy based on my risk tolerance and financial goals.  
            
            - **Investment Horizon:** 3-5 years  
            - **Investment Amount:** ₹1 lakh  
            - **Risk Tolerance:** ${
              activeTab === "conservative"
                ? "Low"
                : activeTab === "moderate"
                  ? "Moderate"
                  : "High"
            }  
            - **Financial Goal:** ${
              activeTab === "conservative"
                ? "Capital preservation and stable returns."
                : activeTab === "moderate"
                  ? "Balanced growth with manageable risk."
                  : "High growth potential with an aggressive approach."
            }  
            
            Please generate a structured financial plan that includes:  
            1. Recommended investment categories (e.g., Bonds, Stocks, Mutual Funds, REITs, Crypto, etc.).  
            2. Expected returns and risk factors for the selected strategy.  
            3. Diversification strategy to minimize potential risks.  
            4. Market trends or economic factors influencing this investment strategy.  
            5. A step-by-step financial pathway that visually represents key decision points in the investment process.`
      );

      formData.append("risk", activeTab);

      const response = await fetch(`${AI_SERVER_URL}/ai-game-path`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.nodes && data.edges) {
        setServerData(data);

        setNodes(
          data.nodes.map((node) => ({
            ...node,
            className: `
                ${node.style.background} !important
                border-2
                ${node.style.border} !important
                rounded-lg
                p-4
                text-center
                font-medium
              `,
            data: {
              ...node.data,
              label: node.data.label.replace("â‚¹", "₹"),
            },
          }))
        );

        setEdges(
          data.edges.map((edge) => ({
            ...edge,
            className: edge.style.stroke,
            source: edge.source,
            target: edge.target,
            label: edge.label,
          }))
        );

        setShowFlowchart(true);

        setTimeout(() => {
          flowchartRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } else {
        console.warn("Invalid server response:", data);
        // Handle the case where the response is not in the expected format
        // You might want to show an error message to the user
      }
    } catch (error) {
      console.error("Error generating pathway:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextareaInput = (e) => {
    setUserInput(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleSampleInput = (text) => {
    setUserInput(text);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const tabs = [
    {
      id: "conservative",
      label: "Conservative",
      color: "purple",
      description:
        "A low-risk investment approach designed to preserve capital while generating stable and predictable returns. This strategy focuses on wealth protection, making it suitable for those prioritizing financial security.",
      returns: "6-8% p.a.",
      suitability:
        "Ideal for risk-averse investors, retirees, and individuals looking for steady income with minimal market exposure.",
      suggestedAssets: [
        "Government Bonds",
        "High-Yield Savings Accounts",
        "Fixed Deposits",
        "Dividend-Paying purple-Chip Stocks",
        "Money Market Funds",
      ],
      aiPersonalizedAdvice: (age, riskTolerance, investmentHorizon) => {
        if (age >= 50 || riskTolerance === "low" || investmentHorizon < 5) {
          return "A conservative strategy is ideal for preserving wealth and generating consistent returns. This approach minimizes market exposure while ensuring financial stability.";
        }
        return "While this strategy provides security, consider a more balanced approach if you have a longer investment horizon and moderate risk tolerance.";
      },
    },
    {
      id: "moderate",
      label: "Moderate",
      color: "greenLime",
      description:
        "A well-balanced investment strategy that combines moderate risk with sustainable growth. It seeks to provide higher returns than conservative investments while limiting excessive volatility.",
      returns: "10-13% p.a.",
      suitability:
        "Well-suited for mid-career professionals, individuals with a long-term perspective, and those seeking a mix of security and growth.",
      suggestedAssets: [
        "Index Funds",
        "Balanced Mutual Funds",
        "Corporate Bonds",
        "Real Estate Investment Trusts (REITs)",
        "Large-Cap Growth Stocks",
      ],
      aiPersonalizedAdvice: (age, riskTolerance, investmentHorizon) => {
        if (age >= 35 && riskTolerance === "medium" && investmentHorizon >= 5) {
          return "A moderate strategy allows you to achieve growth while maintaining stability, making it an excellent choice for mid-career professionals and long-term wealth accumulation.";
        }
        return "If you have a longer investment horizon, you may consider increasing exposure to high-growth assets while maintaining diversification.";
      },
    },
    {
      id: "aggressive",
      label: "Aggressive",
      color: "red",
      description:
        "A high-risk, high-reward investment strategy designed for long-term capital appreciation. It focuses on maximizing returns, accepting short-term volatility in pursuit of substantial growth.",
      returns: "15-25% p.a.",
      suitability:
        "Most appropriate for young investors, high-net-worth individuals, and those with a strong appetite for risk and a long-term investment horizon.",
      suggestedAssets: [
        "Technology Stocks",
        "Cryptocurrency",
        "Venture Capital Funds",
        "Private Equity",
        "Emerging Market ETFs",
      ],
      aiPersonalizedAdvice: (age, riskTolerance, investmentHorizon) => {
        if (age < 35 && riskTolerance === "high" && investmentHorizon >= 10) {
          return "With time on your side, an aggressive strategy can help you achieve substantial wealth accumulation. Ensure you stay diversified to manage risks.";
        }
        return "While this strategy offers high growth potential, it's crucial to reassess your risk tolerance and diversify to mitigate downturns.";
      },
    },
  ];

  return (
    <div className="mx-auto space-y-8 py-2 pr-2">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Sample Inputs:
            </span>
            <span className="ml-2 text-xs text-gray-500">
              (Click to populate)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleInputs.map((sample, index) => (
              <button
                key={index}
                onClick={() => handleSampleInput(sample.text)}
                className="px-3 py-1.5 text-sm bg-white rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 flex items-center group"
              >
                <span className="text-gray-600 group-hover:text-purple-600">
                  {sample.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={handleTextareaInput}
              placeholder="Describe your investment goals, risk tolerance, and preferences..."
              className="w-full min-h-[120px] p-5 text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              style={{ height: "auto" }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleStrategySelect(tab.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-102 ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 bg-gradient-to-br from-${tab.color}-50 to-${tab.color}-100 text-${tab.color}-700 shadow-md`
                    : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">{tab.label}</div>
                <div className="text-sm mt-1 opacity-75">
                  Returns: {tab.returns}
                </div>
              </button>
            ))}
          </div>

          {activeTab && (
            <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {tabs.find((tab) => tab.id === activeTab)?.label} Strategy
              </h2>
              <p className="text-gray-600">
                {tabs.find((tab) => tab.id === activeTab)?.description}
              </p>
              <div className="mt-4">
                <p className="font-medium text-gray-800">Suggested Assets:</p>
                <ul className="list-disc pl-5 text-gray-600">
                  {tabs
                    .find((tab) => tab.id === activeTab)
                    ?.suggestedAssets.map((asset, index) => (
                      <li key={index}>{asset}</li>
                    ))}
                </ul>
              </div>
              <div className="mt-4">
                <p className="font-medium text-gray-800">Suitability:</p>
                <p className="text-gray-600">
                  {tabs.find((tab) => tab.id === activeTab)?.suitability}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
          <button
            onClick={handleGenerate}
            disabled={!activeTab || isGenerating}
            className={`w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 transform hover:scale-102 ${
              activeTab && !isGenerating
                ? "bg-gradient-to-tr from-purple-300 to-purple-500 hover:from-purple-400 hover:to-purple-600 text-white shadow-lg hover:shadow-xl font-semibold"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="h-6 w-6" />
            <span>
              {isGenerating
                ? "Analyzing Your Preferences..."
                : "Generate Investment Pathway"}
            </span>
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl mx-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <h3 className="mt-6 text-xl font-semibold text-gray-900">
            Creating Your Personalized Investment Pathway
          </h3>
          <p className="mt-3 text-gray-600">
            Analyzing your preferences and generating the optimal investment
            strategy...
          </p>
        </div>
      )}

      {showFlowchart && serverData && (
        <div
          ref={flowchartRef}
          className="space-y-6 animate-fade-in scroll-mt-8"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-[700px] w-full bg-gradient-to-br from-gray-50 to-gray-100">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                className="bg-gray-50"
                defaultEdgeOptions={{
                  type: "smoothstep",
                  animated: true,
                  style: { strokeWidth: 2 },
                }}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameFlow;
