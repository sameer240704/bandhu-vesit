Hand landmarks detection guide for Web
The MediaPipe Hand Landmarker task lets you detect the landmarks of the hands in an image. These instructions show you how to use the Hand Landmarker for web and JavaScript apps.

For more information about the capabilities, models, and configuration options of this task, see the Overview.

Code example
The example code for Hand Landmarker provides a complete implementation of this task in JavaScript for your reference. This code helps you test this task and get started on building your own hand landmark detection app. You can view, run, and edit the Hand Landmarker example code using just your web browser.

Setup
This section describes key steps for setting up your development environment specifically to use Hand Landmarker. For general information on setting up your web and JavaScript development environment, including platform version requirements, see the Setup guide for web.

JavaScript packages
Hand Landmarker code is available through the MediaPipe @mediapipe/tasks-vision NPM package. You can find and download these libraries by following the instructions in the platform Setup guide.

Attention: This MediaPipe Solutions Preview is an early release. Learn more.
You can install the required packages through NPM using the following command:


npm install @mediapipe/tasks-vision
If you want to import the task code via a content delivery network (CDN) service, add the following code in the <head> tag in your HTML file:


<!-- You can replace JSDeliver with another CDN if you prefer to -->
<head>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js"
    crossorigin="anonymous"></script>
</head>
Model
The MediaPipe Hand Landmarker task requires a trained model that is compatible with this task. For more information on available trained models for Hand Landmarker, see the task overview Models section.

Select and download a model, and then store it within your project directory:


<dev-project-root>/app/shared/models/
Create the task
Use one of the Hand Landmarker createFrom...() functions to prepare the task for running inferences. Use the createFromModelPath() function with a relative or absolute path to the trained model file. If your model is already loaded into memory, you can use the createFromModelBuffer() method.

The code example below demonstrates using the createFromOptions() function to set up the task. The createFromOptions function allows you to customize the Hand Landmarker with configuration options. For more information on configuration options, see Configuration options.

The following code demonstrates how to build and configure the task with custom options:


const vision = await FilesetResolver.forVisionTasks(
  // path/to/wasm/root
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);
const handLandmarker = await HandLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath: "hand_landmarker.task"
      },
      numHands: 2
    });
Configuration options
This task has the following configuration options for Web and JavaScript applications:

Option Name	Description	Value Range	Default Value
runningMode	Sets the running mode for the task. There are two modes:

IMAGE: The mode for single image inputs.

VIDEO: The mode for decoded frames of a video or on a livestream of input data, such as from a camera.	{IMAGE, VIDEO}	IMAGE
numHands	The maximum number of hands detected by the Hand landmark detector.	Any integer > 0	1
minHandDetectionConfidence	The minimum confidence score for the hand detection to be considered successful in palm detection model.	0.0 - 1.0	0.5
minHandPresenceConfidence	The minimum confidence score for the hand presence score in the hand landmark detection model. In Video mode and Live stream mode, if the hand presence confidence score from the hand landmark model is below this threshold, Hand Landmarker triggers the palm detection model. Otherwise, a lightweight hand tracking algorithm determines the location of the hand(s) for subsequent landmark detections.	0.0 - 1.0	0.5
minTrackingConfidence	The minimum confidence score for the hand tracking to be considered successful. This is the bounding box IoU threshold between hands in the current frame and the last frame. In Video mode and Stream mode of Hand Landmarker, if the tracking fails, Hand Landmarker triggers hand detection. Otherwise, it skips the hand detection.	0.0 - 1.0	0.5
Prepare data
Hand Landmarker can detect hand landmarks in images in any format supported by the host browser. The task also handles data input preprocessing, including resizing, rotation and value normalization. To detect hand landmarks in videos, you can use the API to quickly process one frame at a time, using the timestamp of the frame to determine when the hand landmarks occur within the video.

Run the task
The Hand Landmarker uses the detect() (with running mode image) and detectForVideo() (with running mode video) methods to trigger inferences. The task processes the data, attempts to detect hand landmarks, and then reports the results.

Calls to the Hand Landmarker detect() and detectForVideo() methods run synchronously and block the user interface thread. If you detect hand landmarks in video frames from a device's camera, each detection blocks the main thread. You can prevent this by implementing web workers to run the detect() and detectForVideo() methods on another thread.

The following code demonstrates how execute the processing with the task model:

Image
Video

await handLandmarker.setOptions({ runningMode: "video" });

let lastVideoTime = -1;
function renderLoop(): void {
  const video = document.getElementById("video");

  if (video.currentTime !== lastVideoTime) {
    const detections = handLandmarker.detectForVideo(video);
    processResults(detections);
    lastVideoTime = video.currentTime;
  }

  requestAnimationFrame(() => {
    renderLoop();
  });
}
For a more complete implementation of running an Hand Landmarker task, see the code example.

Handle and display results
The Hand Landmarker generates a hand landmarker result object for each detection run. The result object contains hand landmarks in image coordinates, hand landmarks in world coordinates and handedness(left/right hand) of the detected hands.

The following shows an example of the output data from this task:

The HandLandmarkerResult output contains three components. Each component is an array, where each element contains the following results for a single detected hand:

Handedness

Handedness represents whether the detected hands are left or right hands.

Landmarks

There are 21 hand landmarks, each composed of x, y and z coordinates. The x and y coordinates are normalized to [0.0, 1.0] by the image width and height, respectively. The z coordinate represents the landmark depth, with the depth at the wrist being the origin. The smaller the value, the closer the landmark is to the camera. The magnitude of z uses roughly the same scale as x.

World Landmarks

The 21 hand landmarks are also presented in world coordinates. Each landmark is composed of x, y, and z, representing real-world 3D coordinates in meters with the origin at the hand’s geometric center.


HandLandmarkerResult:
  Handedness:
    Categories #0:
      index        : 0
      score        : 0.98396
      categoryName : Left
  Landmarks:
    Landmark #0:
      x            : 0.638852
      y            : 0.671197
      z            : -3.41E-7
    Landmark #1:
      x            : 0.634599
      y            : 0.536441
      z            : -0.06984
    ... (21 landmarks for a hand)
  WorldLandmarks:
    Landmark #0:
      x            : 0.067485
      y            : 0.031084
      z            : 0.055223
    Landmark #1:
      x            : 0.063209
      y            : -0.00382
      z            : 0.020920
    ... (21 world landmarks for a hand)
The following image shows a visualization of the task output:

A hand in a thumbs up motion with the skeletal structure of the hand mapped out

The Hand Landmarker example code demonstrates how to display the results returned from the task, see the code example


Overview
The ability to perceive the shape and motion of hands can be a vital component in improving the user experience across a variety of technological domains and platforms. For example, it can form the basis for sign language understanding and hand gesture control, and can also enable the overlay of digital content and information on top of the physical world in augmented reality. While coming naturally to people, robust real-time hand perception is a decidedly challenging computer vision task, as hands often occlude themselves or each other (e.g. finger/palm occlusions and hand shakes) and lack high contrast patterns.

MediaPipe Hands is a high-fidelity hand and finger tracking solution. It employs machine learning (ML) to infer 21 3D landmarks of a hand from just a single frame. Whereas current state-of-the-art approaches rely primarily on powerful desktop environments for inference, our method achieves real-time performance on a mobile phone, and even scales to multiple hands. We hope that providing this hand perception functionality to the wider research and development community will result in an emergence of creative use cases, stimulating new applications and new research avenues.

hand_tracking_3d_android_gpu.gif
Fig 1. Tracked 3D hand landmarks are represented by dots in different shades, with the brighter ones denoting landmarks closer to the camera.
ML Pipeline
MediaPipe Hands utilizes an ML pipeline consisting of multiple models working together: A palm detection model that operates on the full image and returns an oriented hand bounding box. A hand landmark model that operates on the cropped image region defined by the palm detector and returns high-fidelity 3D hand keypoints. This strategy is similar to that employed in our MediaPipe Face Mesh solution, which uses a face detector together with a face landmark model.

Providing the accurately cropped hand image to the hand landmark model drastically reduces the need for data augmentation (e.g. rotations, translation and scale) and instead allows the network to dedicate most of its capacity towards coordinate prediction accuracy. In addition, in our pipeline the crops can also be generated based on the hand landmarks identified in the previous frame, and only when the landmark model could no longer identify hand presence is palm detection invoked to relocalize the hand.

The pipeline is implemented as a MediaPipe graph that uses a hand landmark tracking subgraph from the hand landmark module, and renders using a dedicated hand renderer subgraph. The hand landmark tracking subgraph internally uses a hand landmark subgraph from the same module and a palm detection subgraph from the palm detection module.

Note: To visualize a graph, copy the graph and paste it into MediaPipe Visualizer. For more information on how to visualize its associated subgraphs, please see visualizer documentation.

Models
Palm Detection Model
To detect initial hand locations, we designed a single-shot detector model optimized for mobile real-time uses in a manner similar to the face detection model in MediaPipe Face Mesh. Detecting hands is a decidedly complex task: our lite model and full model have to work across a variety of hand sizes with a large scale span (~20x) relative to the image frame and be able to detect occluded and self-occluded hands. Whereas faces have high contrast patterns, e.g., in the eye and mouth region, the lack of such features in hands makes it comparatively difficult to detect them reliably from their visual features alone. Instead, providing additional context, like arm, body, or person features, aids accurate hand localization.

Our method addresses the above challenges using different strategies. First, we train a palm detector instead of a hand detector, since estimating bounding boxes of rigid objects like palms and fists is significantly simpler than detecting hands with articulated fingers. In addition, as palms are smaller objects, the non-maximum suppression algorithm works well even for two-hand self-occlusion cases, like handshakes. Moreover, palms can be modelled using square bounding boxes (anchors in ML terminology) ignoring other aspect ratios, and therefore reducing the number of anchors by a factor of 3-5. Second, an encoder-decoder feature extractor is used for bigger scene context awareness even for small objects (similar to the RetinaNet approach). Lastly, we minimize the focal loss during training to support a large amount of anchors resulting from the high scale variance.

With the above techniques, we achieve an average precision of 95.7% in palm detection. Using a regular cross entropy loss and no decoder gives a baseline of just 86.22%.

Hand Landmark Model
After the palm detection over the whole image our subsequent hand landmark model performs precise keypoint localization of 21 3D hand-knuckle coordinates inside the detected hand regions via regression, that is direct coordinate prediction. The model learns a consistent internal hand pose representation and is robust even to partially visible hands and self-occlusions.

To obtain ground truth data, we have manually annotated ~30K real-world images with 21 3D coordinates, as shown below (we take Z-value from image depth map, if it exists per corresponding coordinate). To better cover the possible hand poses and provide additional supervision on the nature of hand geometry, we also render a high-quality synthetic hand model over various backgrounds and map it to the corresponding 3D coordinates.

hand_landmarks.png
Fig 2. 21 hand landmarks.
hand_crops.png
Fig 3. Top: Aligned hand crops passed to the tracking network with ground truth annotation. Bottom: Rendered synthetic hand images with ground truth annotation.
Solution APIs
Configuration Options
Naming style and availability may differ slightly across platforms/languages.

static_image_mode
If set to false, the solution treats the input images as a video stream. It will try to detect hands in the first input images, and upon a successful detection further localizes the hand landmarks. In subsequent images, once all max_num_hands hands are detected and the corresponding hand landmarks are localized, it simply tracks those landmarks without invoking another detection until it loses track of any of the hands. This reduces latency and is ideal for processing video frames. If set to true, hand detection runs on every input image, ideal for processing a batch of static, possibly unrelated, images. Default to false.

max_num_hands
Maximum number of hands to detect. Default to 2.

model_complexity
Complexity of the hand landmark model: 0 or 1. Landmark accuracy as well as inference latency generally go up with the model complexity. Default to 1.

min_detection_confidence
Minimum confidence value ([0.0, 1.0]) from the hand detection model for the detection to be considered successful. Default to 0.5.

min_tracking_confidence:
Minimum confidence value ([0.0, 1.0]) from the landmark-tracking model for the hand landmarks to be considered tracked successfully, or otherwise hand detection will be invoked automatically on the next input image. Setting it to a higher value can increase robustness of the solution, at the expense of a higher latency. Ignored if static_image_mode is true, where hand detection simply runs on every image. Default to 0.5.

Output
Naming style may differ slightly across platforms/languages.

multi_hand_landmarks
Collection of detected/tracked hands, where each hand is represented as a list of 21 hand landmarks and each landmark is composed of x, y and z. x and y are normalized to [0.0, 1.0] by the image width and height respectively. z represents the landmark depth with the depth at the wrist being the origin, and the smaller the value the closer the landmark is to the camera. The magnitude of z uses roughly the same scale as x.

multi_hand_world_landmarks
Collection of detected/tracked hands, where each hand is represented as a list of 21 hand landmarks in world coordinates. Each landmark is composed of x, y and z: real-world 3D coordinates in meters with the origin at the hand's approximate geometric center.

multi_handedness
Collection of handedness of the detected/tracked hands (i.e. is it a left or right hand). Each hand is composed of label and score. label is a string of value either "Left" or "Right". score is the estimated probability of the predicted handedness and is always greater than or equal to 0.5 (and the opposite handedness has an estimated probability of 1 - score).

Note that handedness is determined assuming the input image is mirrored, i.e., taken with a front-facing/selfie camera with images flipped horizontally. If it is not the case, please swap the handedness output in the application.


JavaScript Solution API
Please first see general introduction on MediaPipe in JavaScript, then learn more in the companion web demo and a [fun application], and the following usage example.

Supported configuration options:

maxNumHands
modelComplexity
minDetectionConfidence
minTrackingConfidence
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" crossorigin="anonymous"></script>
</head>

<body>
  <div class="container">
    <video class="input_video"></video>
    <canvas class="output_canvas" width="1280px" height="720px"></canvas>
  </div>
</body>
</html>
<script type="module">
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();
</script>
