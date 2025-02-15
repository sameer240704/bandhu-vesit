Models
Person/pose Detection Model (BlazePose Detector)
The detector is inspired by our own lightweight BlazeFace model, used in MediaPipe Face Detection, as a proxy for a person detector. It explicitly predicts two additional virtual keypoints that firmly describe the human body center, rotation and scale as a circle. Inspired by Leonardo’s Vitruvian man, we predict the midpoint of a person's hips, the radius of a circle circumscribing the whole person, and the incline angle of the line connecting the shoulder and hip midpoints.

pose_tracking_detector_vitruvian_man.png
Fig 3. Vitruvian man aligned via two virtual keypoints predicted by BlazePose detector in addition to the face bounding box.
Pose Landmark Model (BlazePose GHUM 3D)
The landmark model in MediaPipe Pose predicts the location of 33 pose landmarks (see figure below).

pose_tracking_full_body_landmarks.png
Fig 4. 33 pose landmarks.
Optionally, MediaPipe Pose can predict a full-body segmentation mask represented as a two-class segmentation (human or background).

Please find more detail in the BlazePose Google AI Blog, this paper, the model card and the Output section below.

Solution APIs
Cross-platform Configuration Options
Naming style and availability may differ slightly across platforms/languages.

static_image_mode
If set to false, the solution treats the input images as a video stream. It will try to detect the most prominent person in the very first images, and upon a successful detection further localizes the pose landmarks. In subsequent images, it then simply tracks those landmarks without invoking another detection until it loses track, on reducing computation and latency. If set to true, person detection runs every input image, ideal for processing a batch of static, possibly unrelated, images. Default to false.

model_complexity
Complexity of the pose landmark model: 0, 1 or 2. Landmark accuracy as well as inference latency generally go up with the model complexity. Default to 1.

smooth_landmarks
If set to true, the solution filters pose landmarks across different input images to reduce jitter, but ignored if static_image_mode is also set to true. Default to true.

enable_segmentation
If set to true, in addition to the pose landmarks the solution also generates the segmentation mask. Default to false.

smooth_segmentation
If set to true, the solution filters segmentation masks across different input images to reduce jitter. Ignored if enable_segmentation is false or static_image_mode is true. Default to true.

min_detection_confidence
Minimum confidence value ([0.0, 1.0]) from the person-detection model for the detection to be considered successful. Default to 0.5.

min_tracking_confidence
Minimum confidence value ([0.0, 1.0]) from the landmark-tracking model for the pose landmarks to be considered tracked successfully, or otherwise person detection will be invoked automatically on the next input image. Setting it to a higher value can increase robustness of the solution, at the expense of a higher latency. Ignored if static_image_mode is true, where person detection simply runs on every image. Default to 0.5.

Output
Naming style may differ slightly across platforms/languages.

pose_landmarks
A list of pose landmarks. Each landmark consists of the following:

x and y: Landmark coordinates normalized to [0.0, 1.0] by the image width and height respectively.
z: Represents the landmark depth with the depth at the midpoint of hips being the origin, and the smaller the value the closer the landmark is to the camera. The magnitude of z uses roughly the same scale as x.
visibility: A value in [0.0, 1.0] indicating the likelihood of the landmark being visible (present and not occluded) in the image.
pose_world_landmarks
Fig 5. Example of MediaPipe Pose real-world 3D coordinates.
Another list of pose landmarks in world coordinates. Each landmark consists of the following:

x, y and z: Real-world 3D coordinates in meters with the origin at the center between hips.
visibility: Identical to that defined in the corresponding pose_landmarks.
segmentation_mask
The output segmentation mask, predicted only when enable_segmentation is set to true. The mask has the same width and height as the input image, and contains values in [0.0, 1.0] where 1.0 and 0.0 indicate high certainty of a "human" and "background" pixel respectively. Please refer to the platform-specific usage examples below for usage details.

JavaScript Solution API
Please first see general introduction on MediaPipe in JavaScript, then learn more in the companion web demo and the following usage example.

Supported configuration options:

modelComplexity
smoothLandmarks
enableSegmentation
smoothSegmentation
minDetectionConfidence
minTrackingConfidence
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d/control_utils_3d.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>
</head>

<body>
  <div class="container">
    <video class="input_video"></video>
    <canvas class="output_canvas" width="1280px" height="720px"></canvas>
    <div class="landmark-grid-container"></div>
  </div>
</body>
</html>
<script type="module">
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new LandmarkGrid(landmarkContainer);

function onResults(results) {
  if (!results.poseLandmarks) {
    grid.updateLandmarks([]);
    return;
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.segmentationMask, 0, 0,
                      canvasElement.width, canvasElement.height);

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = 'source-in';
  canvasCtx.fillStyle = '#00FF00';
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = 'destination-atop';
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.globalCompositeOperation = 'source-over';
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                 {color: '#00FF00', lineWidth: 4});
  drawLandmarks(canvasCtx, results.poseLandmarks,
                {color: '#FF0000', lineWidth: 2});
  canvasCtx.restore();

  grid.updateLandmarks(results.poseWorldLandmarks);
}

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();
</script>

Pose landmark detection guide for Web

The MediaPipe Pose Landmarker task lets you detect landmarks of human bodies in an image or video. You can use this task to identify key body locations, analyze posture, and categorize movements. This task uses machine learning (ML) models that work with single images or video. The task outputs body pose landmarks in image coordinates and in 3-dimensional world coordinates.

These instructions show you how to use the Pose Landmarker for web and JavaScript apps. For more information about the capabilities, models, and configuration options of this task, see the Overview.

Code example
The example code for Pose Landmarker provides a complete implementation of this task in JavaScript for your reference. This code helps you test this task and get started on building your own pose landmarker app. You can view, run, and edit the Pose Landmarker example code using just your web browser.

Setup
This section describes key steps for setting up your development environment specifically to use Pose Landmarker. For general information on setting up your web and JavaScript development environment, including platform version requirements, see the Setup guide for web.

JavaScript packages
Pose Landmarker code is available through the MediaPipe @mediapipe/tasks-vision NPM package. You can find and download these libraries by following the instructions in the platform Setup guide.

Attention: This MediaPipe Solutions Preview is an early release. Learn more.
You can install the required packages through NPM using the following command:


npm install @mediapipe/tasks-vision
If you want to import the task code via a content delivery network (CDN) service, add the following code in the <head> tag in your HTML file:


<!-- You can replace JSDeliver with another CDN if you prefer -->
<head>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js"
    crossorigin="anonymous"></script>
</head>
Model
The MediaPipe Pose Landmarker task requires a trained model that is compatible with this task. For more information on available trained models for Pose Landmarker, see the task overview Models section.

Select and download a model, and then store it within your project directory:


<dev-project-root>/app/shared/models/
Create the task
Use one of the Pose Landmarker createFrom...() functions to prepare the task for running inferences. Use the createFromModelPath() function with a relative or absolute path to the trained model file. If your model is already loaded into memory, you can use the createFromModelBuffer() method.

The code example below demonstrates using the createFromOptions() function to set up the task. The createFromOptions() function allows you to customize the Pose Landmarker with configuration options. For more information on configuration options, see Configuration options.

The following code demonstrates how to build and configure the task with custom options:


const vision = await FilesetResolver.forVisionTasks(
  // path/to/wasm/root
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);
const poseLandmarker = await poseLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath: "path/to/model"
      },
      runningMode: runningMode
    });
Configuration options
This task has the following configuration options for Web and JavaScript applications:

Option Name	Description	Value Range	Default Value
runningMode	Sets the running mode for the task. There are two modes:

IMAGE: The mode for single image inputs.

VIDEO: The mode for decoded frames of a video or on a livestream of input data, such as from a camera.	{IMAGE, VIDEO}	IMAGE
numPoses	The maximum number of poses that can be detected by the Pose Landmarker.	Integer > 0	1
minPoseDetectionConfidence	The minimum confidence score for the pose detection to be considered successful.	Float [0.0,1.0]	0.5
minPosePresenceConfidence	The minimum confidence score of pose presence score in the pose landmark detection.	Float [0.0,1.0]	0.5
minTrackingConfidence	The minimum confidence score for the pose tracking to be considered successful.	Float [0.0,1.0]	0.5
outputSegmentationMasks	Whether Pose Landmarker outputs a segmentation mask for the detected pose.	Boolean	False
Prepare data
Pose Landmarker can detect poses in images in any format supported by the host browser. The task also handles data input preprocessing, including resizing, rotation and value normalization. To landmark poses in videos, you can use the API to quickly process one frame at a time, using the timestamp of the frame to determine when the poses occur within the video.

Run the task
The Pose Landmarker uses the detect() (with running mode IMAGE) and detectForVideo() (with running mode VIDEO) methods to trigger inferences. The task processes the data, attempts to landmark poses, and then reports the results.

Calls to the Pose Landmarker detect() and detectForVideo() methods run synchronously and block the user interpose thread. If you detect poses in video frames from a device's camera, each detection blocks the main thread. You can prevent this by implementing web workers to run the detect() and detectForVideo() methods on another thread.

The following code demonstrates how execute the processing with the task model:

Image
Video

await poseLandmarker.setOptions({ runningMode: "VIDEO" });

let lastVideoTime = -1;
function renderLoop(): void {
  const video = document.getElementById("video");

  if (video.currentTime !== lastVideoTime) {
    const poseLandmarkerResult = poseLandmarker.detectForVideo(video);
    processResults(detections);
    lastVideoTime = video.currentTime;
  }

  requestAnimationFrame(() => {
    renderLoop();
  });
}
For a more complete implementation of running an Pose Landmarker task, see the code example.

Handle and display results
The Pose Landmarker returns a poseLandmarkerResult object for each detection run. The result object contains coordinates for each pose landmark.

The following shows an example of the output data from this task:


PoseLandmarkerResult:
  Landmarks:
    Landmark #0:
      x            : 0.638852
      y            : 0.671197
      z            : 0.129959
      visibility   : 0.9999997615814209
      presence     : 0.9999984502792358
    Landmark #1:
      x            : 0.634599
      y            : 0.536441
      z            : -0.06984
      visibility   : 0.999909
      presence     : 0.999958
    ... (33 landmarks per pose)
  WorldLandmarks:
    Landmark #0:
      x            : 0.067485
      y            : 0.031084
      z            : 0.055223
      visibility   : 0.9999997615814209
      presence     : 0.9999984502792358
    Landmark #1:
      x            : 0.063209
      y            : -0.00382
      z            : 0.020920
      visibility   : 0.999976
      presence     : 0.999998
    ... (33 world landmarks per pose)
  SegmentationMasks:
    ... (pictured below)
The output contains both normalized coordinates (Landmarks) and world coordinates (WorldLandmarks) for each landmark.

The output contains the following normalized coordinates (Landmarks):

x and y: Landmark coordinates normalized between 0.0 and 1.0 by the image width (x) and height (y).

z: The landmark depth, with the depth at the midpoint of the hips as the origin. The smaller the value, the closer the landmark is to the camera. The magnitude of z uses roughly the same scale as x.

visibility: The likelihood of the landmark being visible within the image.

The output contains the following world coordinates (WorldLandmarks):

x, y, and z: Real-world 3-dimensional coordinates in meters, with the midpoint of the hips as the origin.

visibility: The likelihood of the landmark being visible within the image.

The following image shows a visualization of the task output:

A woman in a meditative pose. Her pose is highlighted with a wireframe that indicates the positioning of her limbs and torso

The optional segmentation mask represents the likelihood of each pixel belonging to a detected person. The following image is a segmentation mask of the task output:

Segmentation mask of the previous image that outlines the shape of the woman

The Pose Landmarker example code demonstrates how to display the results returned from the task, see the code example