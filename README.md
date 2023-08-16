Controlling Black Magic Camera with TouchDesigner and ESP32
This project aims to enable users to interact with a Black Magic camera using TouchDesigner. Whether it's for professional purposes or more experimental endeavors, such as controlling the camera's iris or focus using voice commands or motion gestures, this project has you covered. The TouchDesigner project provides a user-friendly interface, with all the settings conveniently located in the main window. However, you can also access the 'CAMERA_CONTROL' container to fine-tune the inputs that trigger camera reactions or retrieve information from the camera.

Required Hardware:

ESP32 M5Stack: Get it here
Black Magic Camera
Mac or Windows
(If you want to capture the camera video signal in TouchDesigner, you'll need the adapter from Black Magic: Adapter Link)
Software:

Visual Studio Code: Download here (free)
Platform IO extension: https://docs.platformio.org/en/stable/integration/ide/vscode.html#installation
TouchDesigner: Download here (free)
For Mac users, download the driver available in the "01_Driver_Usb_Mac" folder.
Setup:
0. Install all the necessary software.

Upload the code by marklysze to your M5Stack. You can find the repository and instructions here: GitHub Repository
After uploading "m5stack-grey-touchdesigner" to your board, you can establish the initial Bluetooth connection with your Blackmagic camera.
Close Visual Studio and launch the TouchDesigner project (included in this repository).
In TouchDesigner, you need to establish the serial connection by identifying your port name and baud rate. Once connected, you'll be able to control your Black Magic camera using the 'CAMERA_CONTROL' UI.
To capture the video signal from your camera in TouchDesigner, you can use the Black Magic UltraStudio Recorder 3G.
Enjoy the functionalities!
Note: A video tutorial will be available as soon as possible.

Credits to marklysze for their significant assistance and excellent work on ESP32 connection and TouchDesigner adaptation!