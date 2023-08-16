Controlling a Black Magic Camera with TouchDesigner and ESP32
This project aims to empower users to interact with a Black Magic camera using TouchDesigner. Whether you're pursuing professional applications or engaging in more experimental pursuits, such as manipulating the camera's iris or focus through voice commands or motion gestures, this project has something to offer. The TouchDesigner project presents an intuitive interface, with all settings conveniently accessible from the main window. Additionally, you have the option to access the 'CAMERA_CONTROL' container, allowing you to fine-tune input parameters that trigger camera responses or fetch information from the camera.

Required Hardware:

ESP32 M5Stack: Get it here
Black Magic Camera
Compatible with Mac or Windows
(To capture camera video in TouchDesigner, an adapter from Black Magic is required: [Adapter Link](adapter link))
Software:

Visual Studio Code: Download here (free)
PlatformIO Extension: [Installation Guide](PlatformIO link)
TouchDesigner: Download here (free)
For Mac users, download the driver available in the "01_Driver_Usb_Mac" folder.
Setup:
0. Begin by installing all necessary software components.

Upload the code by marklysze onto your M5Stack. The repository and instructions are available here: [GitHub Repository](GitHub link).

Once "m5stack-grey-touchdesigner" is uploaded to your board, you can initiate the initial Bluetooth connection with your Blackmagic camera.

Close Visual Studio and launch the provided TouchDesigner project (included in this repository).

In TouchDesigner, establish a serial connection by identifying your port name and configuring the baud rate. Upon successful connection, you'll gain control over your Black Magic camera using the 'CAMERA_CONTROL' user interface.

To capture your camera's video signal within TouchDesigner, leverage the Black Magic UltraStudio Recorder 3G.

Enjoy the expanded functionalities!

Note: A video tutorial detailing the process will be made available in the near future.

Special acknowledgment to marklysze for their invaluable assistance and remarkable contributions to the ESP32 connection and TouchDesigner adaptation!
