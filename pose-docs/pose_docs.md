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