import cv2
import mediapipe as mp
import time
import random
import numpy as np
global difficulty_factor, BALLOON_SPAWN_INTERVAL

# Game configuration
GAME_WIDTH = 1280
GAME_HEIGHT = 720
MAX_BALLOONS = 15
BALLOON_SPAWN_INTERVAL = random.uniform(0.4, 1.2)  # Random spawn intervals
COLORS = [
    (255, 182, 193),  # Pastel Pink
    (147, 197, 253),  # Pastel Blue
    (255, 223, 186),  # Pastel Orange
    (207, 235, 176),  # Pastel Green
    (255, 255, 186),  # Pastel Yellow
    (221, 160, 221)   # Pastel Purple
]

# MediaPipe setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    model_complexity=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

# Add this in the game configuration section
BASE_SPAWN_INTERVAL = 1.5
MIN_SPAWN_INTERVAL = 0.3
SCORE_SPAWN_FACTOR = 0.0002  # Adjust this to control how fast spawning increases

class Balloon:
    def __init__(self, game_width, game_height):
        self.game_width = game_width
        self.game_height = game_height
        self.radius = random.randint(20, 50)  # Smaller balloons
        self.speed = random.randint(150, 300)  # Increased speed range
        self.x = random.randint(self.radius, game_width - self.radius)
        self.y = game_height + self.radius
        self.color = random.choice(COLORS)
        self.is_popped = False
        self.drift = random.uniform(-1.2, 1.2)  # More aggressive drift
        self.points = int(80 * (50/self.radius) * (self.speed/250))  # Adjusted scoring

    def update(self, dt):
        self.y -= self.speed * dt
        self.x += self.drift * self.speed * dt
        # Keep within screen bounds
        self.x = np.clip(self.x, self.radius, self.game_width - self.radius)
        
        if self.y < -self.radius:
            self.is_missed = True

    def draw(self, image):
        if not self.is_popped:
            # Create transparent overlay
            overlay = image.copy()
            alpha = 0.7  # Transparency factor
            
            # Draw main balloon body
            cv2.circle(overlay, (int(self.x), int(self.y)), 
                      self.radius, self.color, -1)
            
            # Add highlights
            highlight_pos = (int(self.x - self.radius/3), 
                           int(self.y - self.radius/3))
            cv2.circle(overlay, highlight_pos, int(self.radius/4), 
                     (255, 255, 255, 128), -1)
            
            # Add shadow
            shadow_pos = (int(self.x + self.radius/4), 
                        int(self.y + self.radius/4))
            cv2.circle(overlay, shadow_pos, int(self.radius/3), 
                     (0, 0, 0, 50), -1)
            
            # Blend with original image
            cv2.addWeighted(overlay, alpha, image, 1 - alpha, 0, image)

    def check_collision(self, x, y):
        distance = ((x - self.x)**2 + (y - self.y)**2)**0.5
        return distance <= self.radius

def draw_hand_landmarks(image, hand_landmarks):
    overlay = image.copy()
    alpha = 0.65  # Overall transparency
    
    for idx, landmark in enumerate(hand_landmarks.landmark):
        x = int(landmark.x * image.shape[1])
        y = int(landmark.y * image.shape[0])
        
        # Special styling for index finger tip
        if idx == mp_hands.HandLandmark.INDEX_FINGER_TIP:
            # Pastel green with white core
            cv2.circle(overlay, (x, y), 12, (150, 255, 150), -1)
            cv2.circle(overlay, (x, y), 6, (255, 255, 255), -1)
        else:
            # Light grey dots for other landmarks
            cv2.circle(overlay, (x, y), 6, (180, 180, 180), -1)
            cv2.circle(overlay, (x, y), 3, (220, 220, 220), -1)

    
    # Blend landmarks with main image
    cv2.addWeighted(overlay, alpha, image, 1 - alpha, 0, image)

# Initialize game state
game_active = False
score = 0
high_score = 0
balloons = []
last_spawn = time.time()
prev_time = time.time()
difficulty_factor = 1.0  # Initial difficulty factor
difficulty_adjustment_interval = 5  # Adjust difficulty every 5 seconds
last_difficulty_adjustment = time.time()
base_spawn_interval = 1.2
min_spawn_interval = 0.4
missed_balloon_penalty = 35  # Increased penalty
accuracy_threshold_increase = 0.8  # Higher accuracy required
accuracy_threshold_decrease = 0.6  # More lenient decrease threshold
total_balloons_spawned = 0
balloons_popped = 0
MAX_SCORE = 10000 # Maximum score

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, GAME_WIDTH)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, GAME_HEIGHT)
cap.set(cv2.CAP_PROP_FPS, 60)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    frame = cv2.flip(frame, 1)
    current_time = time.time()
    dt = current_time - prev_time
    prev_time = current_time
    
    # Process hand detection
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb_frame)
    
    if game_active:
        # Update game state
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Get index finger tip coordinates
                idx_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
                x = int(idx_tip.x * GAME_WIDTH)
                y = int(idx_tip.y * GAME_HEIGHT)
                
                # Check collisions
                for balloon in balloons:
                    if balloon.check_collision(x, y) and not balloon.is_popped:
                        balloon.is_popped = True
                        score += balloon.points
                        # Add visual feedback
                        cv2.circle(frame, (int(balloon.x), int(balloon.y)), 
                                  balloon.radius*2, (255, 255, 255), 3)
        
        # Spawn new balloons
        if current_time - last_spawn > BALLOON_SPAWN_INTERVAL:
            if len(balloons) < MAX_BALLOONS:
                balloons.append(Balloon(GAME_WIDTH, GAME_HEIGHT))
                total_balloons_spawned += 1
            last_spawn = current_time
            # Dynamically adjust spawn interval based on score
            BALLOON_SPAWN_INTERVAL = max(
                BASE_SPAWN_INTERVAL - (score * SCORE_SPAWN_FACTOR),
                MIN_SPAWN_INTERVAL
            )
        
        # Update and draw balloons
        active_balloons = []
        for balloon in balloons:
            balloon.update(dt)
            if not balloon.is_popped and not hasattr(balloon, 'is_missed') and balloon.y > -balloon.radius*2:
                balloon.draw(frame)
                active_balloons.append(balloon)
            elif hasattr(balloon, 'is_missed'):
                if not balloon.is_popped:
                    score -= missed_balloon_penalty
                    score = max(0, score)  # Ensure score doesn't go negative
                    print("Balloon missed! Penalty applied.")
            else:
                balloons_popped += 1
        balloons = active_balloons
        
        # Dynamic difficulty adjustment based on accuracy
        if current_time - last_difficulty_adjustment > difficulty_adjustment_interval:
            accuracy = balloons_popped / total_balloons_spawned if total_balloons_spawned > 0 else 0
            if accuracy > accuracy_threshold_increase and difficulty_factor < 2.0:
                difficulty_factor += 0.1
                difficulty_factor = min(difficulty_factor, 2.0)  # Limit max difficulty
                print(f"Difficulty increased to {difficulty_factor:.1f} (Accuracy: {accuracy:.2f})")
            elif accuracy < accuracy_threshold_decrease and difficulty_factor > 0.6:
                difficulty_factor -= 0.05
                print(f"Difficulty decreased to {difficulty_factor:.1f} (Accuracy: {accuracy:.2f})")
            
            # Adjust balloon spawn interval based on difficulty
            BALLOON_SPAWN_INTERVAL = base_spawn_interval / difficulty_factor
            BALLOON_SPAWN_INTERVAL = max(BALLOON_SPAWN_INTERVAL, min_spawn_interval)  # Ensure it doesn't go too low
            
            last_difficulty_adjustment = current_time
            balloons_popped = 0
            total_balloons_spawned = 0

        score = min(score, MAX_SCORE)

        # Draw score display
        cv2.putText(frame, f"Score: {score}", (20, 50), 
                   cv2.FONT_HERSHEY_DUPLEX, 1.5, (255, 255, 255), 2)
        cv2.putText(frame, f"High Score: {high_score}", (20, 100), 
                   cv2.FONT_HERSHEY_DUPLEX, 1.5, (255, 255, 255), 2)
    else:
        # Start screen
        cv2.putText(frame, "Balloon Pop!", (GAME_WIDTH//4, GAME_HEIGHT//3), 
                   cv2.FONT_HERSHEY_TRIPLEX, 2, (255, 255, 255), 3)
        cv2.putText(frame, "Press 'S' to Start", (GAME_WIDTH//4, GAME_HEIGHT//2), 
                   cv2.FONT_HERSHEY_DUPLEX, 1.5, (200, 255, 200), 2)
        cv2.putText(frame, "Press 'Q' to Quit", (GAME_WIDTH//4, GAME_HEIGHT//2 + 60), 
                   cv2.FONT_HERSHEY_DUPLEX, 1.5, (200, 200, 255), 2)

    # Draw hand landmarks with new style
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            draw_hand_landmarks(frame, hand_landmarks)

    cv2.imshow('Balloon Pop - Premium Edition', frame)
    
    key = cv2.waitKey(1)
    if key == ord('q'):
        break
    elif key == ord('s'):
        game_active = True
        score = 0
        balloons = []
        last_spawn = time.time()
        prev_time = time.time()
        high_score = max(score, high_score)

cap.release()
cv2.destroyAllWindows()