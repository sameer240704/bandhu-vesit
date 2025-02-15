# main.py
from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Optional
from dotenv import load_dotenv
from scenario_saga import ScenarioSaga
from services.gemini_game_flow import get_gemini_response
from services.wellness import process_input

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ai-game-path")
async def ai_financial_path(
    input: str = Form(...), 
    risk: Optional[str] = Form("conservative")
):  
    """Generates an AI-based financial planning response."""
    try:
        response = get_gemini_response(input, risk)
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")
    
@app.post("/ai-chatbot")
async def ai_chatbot(input: str = Form(...), type: str = Form("chatbot")):
    response = process_input(input, type)

    return response


@app.post("/scenario-saga")
async def start_scenario(name: str = Form(...), age: int = Form(...)) -> Dict:
    try:
        scenario, image, options = game_instance.start_game(name, age)  # Call the method from the instance
        return {
            "scenario": scenario,
            "image": image.decode("utf-8"),  # Convert bytes to string (Base64 recommended for frontend use)
            "options": options
        }
    except Exception as e:
        return {"error": str(e)}
