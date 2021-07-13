var twist;
var cmdVel;
var publishImmidiately = true;
var robot_IP;
/*Choose between static IP address for the robot or dynamically defined IP with location.hostname depending on your configuration. If the web server is running on a device different than the robot, IP must be set manually to the robot address. If the app is deployed to a server which is running on your robot, it can be set automatically. */
var manager;
var teleop;
var ros;

function moveAction(linear, angular) {
    if (linear !== undefined && angular !== undefined) {
        twist.linear.x = linear;
        twist.angular.z = angular;
    } else {
        twist.linear.x = 0;
        twist.angular.z = 0;
    }
    cmdVel.publish(twist);
}

function initVelocityPublisher() {
    // Init message with zero values.
    twist = new ROSLIB.Message({
        linear: {
            x: 0,
            y: 0,
            z: 0
        },
        angular: {
            x: 0,
            y: 0,
            z: 0
        }
    });
    // Init topic object
    cmdVel = new ROSLIB.Topic({
        ros: ros,
        name: '/cmd_vel_mux/input/navi',
        messageType: 'geometry_msgs/Twist'
    });
    // Register publisher within ROS system
    cmdVel.advertise();
}


    function initTeleopKeyboard() {
        // Use w, s, a, d keys to drive your robot
    
        // Check if keyboard controller was aready created
        if (teleop == null) {
            // Initialize the teleop.
            teleop = new KEYBOARDTELEOP.Teleop({
                ros: ros,
                topic: '/cmd_vel_mux/input/navi'
            });
        }
    
        // Add event listener for slider moves
        robotSpeedRange = document.getElementById("robot-speed");
        robotSpeedRange.oninput = function () {
            teleop.scale = robotSpeedRange.value / 100
        }
    }


    window.onload = function () {
        // determine robot address automatically
        // robot_IP = location.hostname;
        // set robot address statically
        robot_IP = "10.0.2.15";
    
        // // Init handle for rosbridge_websocket
        ros = new ROSLIB.Ros({
            url: "ws://localhost:9090"
        });
    
        initVelocityPublisher();
        // get handle for video placeholder
        video = document.getElementById('video');
        // Populate video source 
        video.src = "http://localhost:8080/stream?topic=/camera/rgb/image_raw&type=mjpeg&quality=80";
        video.onload = function () {
            // joystick and keyboard controls will be available only when video is correctly loaded
            initTeleopKeyboard();
        };
    }

