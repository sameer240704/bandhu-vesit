# scenario_saga.py
from typing import List, Dict, Optional, Tuple
import requests
import os
from dotenv import load_dotenv
import base64

# Load environment variables
load_dotenv()

class ScenarioSaga:
    def __init__(self):
        # API Configuration
        self.github_token = os.getenv("GITHUB_TOKEN")
        self.endpoint = os.getenv("ENDPOINT")
        self.model_name = os.getenv("MODEL_NAME")
        self.huggingface_key = os.getenv("HUGGINGFACE_API_KEY")
        
        # Game state
        self.story = []
        self.iteration = 0
        self.character_name = ""
        self.character_age = None
        self.setup_complete = False

    def _get_age_context(self, age: int) -> str:
        """Generate age-appropriate context for story generation."""
        if age <= 25:
            return """
            Generate a realistic starting scenario for a young person (0-25 years). 
            Focus on relatable situations like school, college, sports, first job, friendship dynamics, 
            family relationships, social media challenges, or personal growth moments. 
            Avoid fantasy elements like magical objects, portals, or supernatural events.
            """
        elif age <= 50:
            return """
            Generate a realistic starting scenario for an adult (26-50 years).
            Focus on real-life situations like career challenges, relationship dynamics, 
            parenting decisions, work-life balance, community involvement, personal development, 
            or health and wellness journeys. Avoid fantasy elements and focus on authentic life moments.
            """
        else:
            return """
            Generate a realistic starting scenario for a mature adult (50+ years).
            Focus on meaningful life situations like family relationships, retirement transitions, 
            community leadership, mentoring others, pursuing new interests, health management, 
            or reflecting on life experiences. Create grounded, authentic scenarios without fantasy elements.
            """

    def generate_starting_scenario(self, age: int, name: str) -> str:
        """Generate a custom starting scenario based on age group."""
        headers = {
            "Authorization": f"Bearer {self.github_token}",
            "Content-Type": "application/json"
        }
        
        age_context = self._get_age_context(age)
        
        data = {
            "model": self.model_name,
            "messages": [
                {
                    "role": "system",
                    "content": f"""You are a creative storyteller who creates realistic, engaging scenarios.
                    {age_context}
                    The scenario should be 1 sentence long and include the character's name.
                    Focus on creating a moment of decision, discovery, or challenge that could lead to
                    personal growth or meaningful change."""
                },
                {
                    "role": "user",
                    "content": f"Generate a realistic starting scenario for {name}, age {age}."
                }
            ],
            "temperature": 0.9,
            "max_tokens": 150
        }
        
        try:
            response = requests.post(
                f"{self.endpoint}/openai/deployments/{self.model_name}/chat/completions?api-version=2023-05-15", 
                headers=headers, 
                json=data
            )
            response.raise_for_status()
            
            result = response.json()
            return result["choices"][0]["message"]["content"].strip()
            
        except Exception as e:
            raise Exception(f"Error generating starting scenario: {str(e)}")

    def generate_story_options(self, prompt: str) -> List[str]:
        """Generate story continuations based on the current scenario."""
        headers = {
            "Authorization": f"Bearer {self.github_token}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.model_name,
            "messages": [
                {
                    "role": "system",
                    "content": """You are a creative storyteller focused on realistic narratives.
                    Generate three short, distinct, and engaging story continuations.
                    Each option should be grounded in reality and lead to different possible outcomes
                    with potential for personal growth or life lessons.
                    Keep each option to 2 sentences maximum.
                    Focus on realistic challenges, decisions, and human interactions rather than
                    fantastical elements."""
                },
                {
                    "role": "user",
                    "content": f"Generate 3 different possible realistic continuations for this story moment: {prompt}"
                }
            ],
            "temperature": 0.7,
            "max_tokens": 300
        }
        
        try:
            response = requests.post(
                f"{self.endpoint}/openai/deployments/{self.model_name}/chat/completions?api-version=2023-05-15", 
                headers=headers, 
                json=data
            )
            response.raise_for_status()
            
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            options = [opt.strip() for opt in content.split("\n") if opt.strip()]
            return options[:3]
            
        except Exception as e:
            raise Exception(f"Error generating story options: {str(e)}")

    def generate_scene_image(self, prompt: str) -> bytes:
        """Generate an image based on the current story scenario."""
        API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
        headers = {
            "Authorization": f"Bearer {self.huggingface_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "inputs": f"A vibrant, detailed, realistic illustration of: {prompt}",
            "parameters": {
                "num_inference_steps": 50,
                "guidance_scale": 7.5,
                "width": 1024,
                "height": 1024,
                "num_images_per_prompt": 1
            }
        }
        
        try:
            response = requests.post(API_URL, headers=headers, json=payload)
            response.raise_for_status()
            return response.content
        except Exception as e:
            raise Exception(f"Error generating image: {str(e)}")

    def start_game(self, name: str, age: int) -> Tuple[str, bytes, List[str]]:
        """Start a new game with character setup."""
        self.character_name = name
        self.character_age = age
        self.setup_complete = True
        self.iteration = 0
        self.story = []

        # Generate initial scenario
        scenario = self.generate_starting_scenario(age, name)
        self.story.append(scenario)
        
        # Generate image for the scenario
        image = self.generate_scene_image(scenario)
        
        # Generate initial options
        options = self.generate_story_options(scenario)
        
        self.iteration += 1
        return scenario, image, options

    def choose_option(self, option_index: int) -> Tuple[Optional[str], Optional[bytes], Optional[List[str]]]:
        """Continue the story based on the chosen option."""
        if not self.setup_complete:
            raise Exception("Game not started. Call start_game first.")
            
        if option_index < 0 or option_index >= 3:
            raise Exception("Invalid option index")
            
        if self.iteration >= 5:
            return "Story has reached its conclusion!", None, None
            
        current_options = self.generate_story_options(self.story[-1])
        chosen_scenario = current_options[option_index]
        self.story.append(chosen_scenario)
        
        # Generate image for the new scenario
        image = self.generate_scene_image(chosen_scenario)
        
        # Generate new options if not at the end
        next_options = None
        if self.iteration < 4:
            next_options = self.generate_story_options(chosen_scenario)
        
        self.iteration += 1
        return chosen_scenario, image, next_options

    def get_story_so_far(self) -> List[str]:
        """Get the complete story up to the current point."""
        return self.story.copy()

    def is_game_complete(self) -> bool:
        """Check if the story has reached its conclusion."""
        return self.iteration >= 5

# Example usage:
if __name__ == "__main__":
    # Create game instance
    game = ScenarioSaga()
    
    try:
        # Start new game
        print("Starting new game...")
        scenario, image, options = game.start_game("Alice", 25)
        print(f"\nStarting scenario: {scenario}")
        print("\nOptions:")
        for i, opt in enumerate(options):
            print(f"{i + 1}. {opt}")
        
        # Simulate choosing options
        while not game.is_game_complete():
            choice = int(input("\nChoose an option (1-3): ")) - 1
            scenario, image, options = game.choose_option(choice)
            print(f"\nChosen path: {scenario}")
            
            if options:
                print("\nNew options:")
                for i, opt in enumerate(options):
                    print(f"{i + 1}. {opt}")
            else:
                print("\nStory complete!")
        
        # Print full story
        print("\nComplete story:")
        for i, chapter in enumerate(game.get_story_so_far()):
            print(f"\nChapter {i + 1}:")
            print(chapter)
            
    except Exception as e:
        print(f"Error: {str(e)}")