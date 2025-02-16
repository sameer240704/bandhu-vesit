import cv2
import mediapipe as mp
import numpy as np
import time
from constants import GAME_CONFIG, WALL_IMAGES

class HoleInTheWallGame:
    def __init__(self):
        self.wall_images = []
        self.white_pixel_sets = []
        self.current_wall_index = 0
        self.level = 1
        self.score = 0
        self.last_level_break = 0
        self.camera_width = GAME_CONFIG['CAMERA_WIDTH']
        self.camera_height = GAME_CONFIG['CAMERA_HEIGHT']
        self.game_active = False  # Game state

        # Initialize MediaPipe components first
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_connections = self.mp_pose.POSE_CONNECTIONS
        
        # Initialize pose detector
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

        # Add wall presentation state
        self.current_wall_start_time = 0
        self.current_wall_opacity = 0.0
        self.wall_active = False

        # Add difficulty tracking
        self.base_wall_duration = GAME_CONFIG['WALL_FADE_DURATION']
        self.current_wall_duration = self.base_wall_duration
        self.min_wall_duration = 2000  # 2 seconds minimum

        # Update drawing styles for pastel colors
        self.landmark_style = self.mp_drawing.DrawingSpec(
            color=(255, 182, 193),  # Pastel pink
            thickness=2,
            circle_radius=3
        )
        self.connection_style = self.mp_drawing.DrawingSpec(
            color=(147, 197, 253),  # Pastel blue
            thickness=2,
            circle_radius=2
        )

        # Load walls and process images
        print("Loading walls...")
        self.load_walls()
        print("Walls loaded successfully")

        # Initialize camera
        print("Initializing camera...")
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            print("Error: Cannot open webcam")
            raise IOError("Cannot open webcam")
        print("Camera opened successfully")
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.camera_width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.camera_height)
        print(f"Camera width: {self.camera_width}, height: {self.camera_height}")

        # Add segmentation mask support - REMOVED
        self.segmentation_mask = None
        self.last_pose_time = 0
        self.pose_detection_interval = 0.1  # Seconds between pose updates

    def load_walls(self):
        """Loads wall images and pre-processes them to identify white pixels."""
        for image_path in WALL_IMAGES:
            print(f"Loading image: {image_path}")
            img = cv2.imread(image_path)
            if img is None:
                print(f"Error: Could not read image at {image_path}")
                raise ValueError(f"Could not read image at {image_path}")
            
            # Resize the image to match camera dimensions
            img = cv2.resize(img, (self.camera_width, self.camera_height))
            print(f"Image resized to: {img.shape}")
            
            self.wall_images.append(img)
            print(f"Image loaded successfully: {image_path}")
            self.white_pixel_sets.append(self.process_wall_image(img))
        print("All walls loaded successfully")

    def process_wall_image(self, img):
        """Identifies white pixels in the wall image."""
        print(f"Processing image with dimensions: {img.shape}")
        white_pixels = set()
        for y in range(img.shape[0]):
            for x in range(img.shape[1]):
                if all(img[y, x] > GAME_CONFIG['WHITE_PIXEL_THRESHOLD']):
                    white_pixels.add((x, y))
        print(f"Found {len(white_pixels)} white pixels")
        return white_pixels

    def process_frame(self, image):
        """Process frame with pose estimation and segmentation."""
        image.flags.writeable = False
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.pose.process(image)
        
        # Get segmentation mask - REMOVED
        #if results.segmentation_mask is not None:
        #    self.segmentation_mask = cv2.resize(
        #        results.segmentation_mask.astype(np.float32), 
        #        (self.camera_width, self.camera_height)
        #    )
        
        return results

    def run(self):
        """Main game loop."""
        print("Starting main game loop...")
        try:
            while True:
                print("Capturing frame...")
                success, image = self.cap.read()
                if not success:
                    print("Ignoring empty camera frame.")
                    continue

                # Flip the image horizontally for a selfie-view display.
                image = cv2.flip(image, 1)
                display_frame = image.copy()
                timestamp = time.time()

                if self.game_active:
                    print("Game is active")
                    # Process the image and detect pose landmarks
                    results = self.process_frame(image.copy())
                    
                    # Draw pose landmarks directly on camera feed
                    if results.pose_landmarks:
                        self.draw_pose_landmarks(image, results.pose_landmarks)
                        self.last_pose_landmarks = results.pose_landmarks

                    # Handle wall presentation
                    if not self.wall_active:
                        self.start_new_wall()
                    
                    # Update wall transparency
                    self.update_wall_transparency(timestamp)
                    
                    # Composite the wall overlay
                    display_frame = self.composite_frame(image, timestamp)
                    
                    # Display UI elements
                    self.draw_ui(display_frame)
                else:
                    print("Game is not active (start screen)")
                    # Draw start screen
                    cv2.putText(display_frame, "Hole in the Wall", 
                               (self.camera_width//4, self.camera_height//3), 
                               cv2.FONT_HERSHEY_TRIPLEX, 2, (255, 255, 255), 3)
                    cv2.putText(display_frame, "Press 'S' to Start", 
                               (self.camera_width//4, self.camera_height//2), 
                               cv2.FONT_HERSHEY_DUPLEX, 1.5, (200, 255, 200), 2)
                    cv2.putText(display_frame, "Press 'Q' to Quit", 
                               (self.camera_width//4, self.camera_height//2 + 60), 
                               cv2.FONT_HERSHEY_DUPLEX, 1.5, (200, 200, 255), 2)

                # Show final composited frame
                cv2.imshow('Hole in the Wall', display_frame)
                
                # Handle user input
                key = cv2.waitKey(1)
                if key == ord('q'):  # ESC key to exit
                    print("Exiting game...")
                    break
                elif key == ord('s'):  # Start game
                    print("Starting game...")
                    self.game_active = True
                    self.score = 0
                    self.level = 1
                    self.current_wall_index = 0
                elif key == ord('n'):  # Debug: skip level
                    self.next_level()
        except Exception as e:
            print(f"An error occurred: {e}")

        print("Releasing camera...")
        self.cap.release()
        print("Destroying all windows...")
        cv2.destroyAllWindows()

    def start_new_wall(self):
        self.wall_active = True
        self.current_wall_start_time = time.time()
        self.current_wall_opacity = 0.0

    def update_wall_transparency(self, current_time):
        elapsed = current_time - self.current_wall_start_time
        self.current_wall_opacity = min(elapsed / (self.current_wall_duration / 1000), 1.0)
        if self.current_wall_opacity >= 1.0:
            if self.wall_active:  # Only handle completion once
                self.handle_wall_completion()
                self.wall_active = False  # Prevent multiple checks

    def composite_frame(self, camera_frame, timestamp):
        # Create copy of camera frame with pose landmarks
        composite = camera_frame.copy()
        
        # Get current wall image
        wall_img = self.wall_images[self.current_wall_index]
        
        # Apply wall overlay with current opacity
        if self.wall_active:
            wall_overlay = cv2.resize(wall_img, (camera_frame.shape[1], camera_frame.shape[0]))
            composite = cv2.addWeighted(
                composite, 1 - self.current_wall_opacity,
                wall_overlay, self.current_wall_opacity,
                0
            )
        
        return composite

    def draw_pose_landmarks(self, image, landmarks):
        # Draw landmarks with custom style
        self.mp_drawing.draw_landmarks(
            image,
            landmarks,
            self.mp_pose.POSE_CONNECTIONS,
            landmark_drawing_spec=self.landmark_style,
            connection_drawing_spec=self.connection_style
        )
        
    def draw_ui(self, frame):
        cv2.putText(frame, f"Score: {self.score}", (10, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
        cv2.putText(frame, f"Level: {self.level}", (10, 70), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

    def handle_wall_completion(self):
        # Check collision and advance level
        wall_img = self.wall_images[self.current_wall_index]
        
        # Get fresh pose data at completion time
        success, image = self.cap.read()
        if success:
            image = cv2.flip(image, 1)
            results = self.process_frame(image)
            self.last_pose_landmarks = results.pose_landmarks
        
        is_safe = self.check_pose_collision(
            self.last_pose_landmarks, 
            self.white_pixel_sets[self.current_wall_index],
            wall_img.shape[1], 
            wall_img.shape[0]
        )

        if is_safe:
            print("Pose accepted! Moving to next level")
            self.score += 100
            self.next_level()
            self.start_new_wall()  # Start next wall immediately
        else:
            print("Game Over! Pose doesn't match")
            self.game_active = False

    def check_pose_collision(self, pose_landmarks, white_pixels, wall_width, wall_height):
        """Checks if ALL detected landmarks are in safe zone"""
        if pose_landmarks is None:
            return False

        required_landmarks = [
            self.mp_pose.PoseLandmark.LEFT_SHOULDER,
            self.mp_pose.PoseLandmark.RIGHT_SHOULDER,
            self.mp_pose.PoseLandmark.LEFT_HIP,
            self.mp_pose.PoseLandmark.RIGHT_HIP
        ]

        for landmark_id in required_landmarks:
            landmark = pose_landmarks.landmark[landmark_id]
            if landmark.visibility < 0.5:  # Ignore non-visible landmarks
                continue
                
            x = int(landmark.x * wall_width)
            y = int(landmark.y * wall_height)
            
            # Check with 5px tolerance
            safe = any(
                (x+dx, y+dy) in white_pixels
                for dx in [-5,0,5]
                for dy in [-5,0,5]
            )
            
            if not safe:
                return False
        
        return True

    def score_level(self, result):
        """Scores the level based on the pose matching result."""
        print(f"Level {self.level} result: {result}")
        if result == "Perfect!":
            self.score += 100
        elif result == "Great!":
            self.score += 75
        elif result == "Good!":
            self.score += 50

    def next_level(self):
        """Advances to the next level."""
        self.current_wall_index = (self.current_wall_index + 1) % len(self.wall_images)
        self.level += 1
        print(f"Advancing to level {self.level}")

    def display_level_break(self):
        """Displays a break screen between levels."""
        print("Level Break!")
        break_duration = 3  # seconds
        start_time = time.time()

        while time.time() - start_time < break_duration:
            break_image = np.zeros((self.camera_height, self.camera_width, 3), dtype=np.uint8)
            text = f"Level Break! Next level in {int(break_duration - (time.time() - start_time))}..."
            cv2.putText(break_image, text, (50, self.camera_height // 2), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
            cv2.imshow('Hole in the Wall', break_image)
            cv2.waitKey(1)

if __name__ == "__main__":
    game = HoleInTheWallGame()
    game.run()
