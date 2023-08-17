# *Control Black Magic Camera with TouchDesigner and ESP32*

This project aims to enable users to interact with a Black Magic camera using TouchDesigner. Whether it's for professional purposes or more experimental endeavors, such as controlling the camera's iris or focus using voice commands or motion gestures, this project has you covered. The TouchDesigner project provides a user-friendly interface, with all the settings conveniently located in the main window. However, you can also access the 'CAMERA_CONTROL' container to fine-tune the inputs that trigger camera reactions or retrieve information from the camera.

**Required Hardware:**
- ESP32 M5Stack: [Get it here](https://shop.m5stack.com/products/basic-core-iot-development-kit?variant=16804801937498)
- Black Magic Camera
- Mac or Windows
- (If you want to capture the camera video signal in TouchDesigner, you'll need the adapter from Black Magic: [Adapter Link](https://www.blackmagicdesign.com/fr/products/ultrastudio/techspecs/W-DLUS-12))

**Software:**
- Visual Studio Code: [Download here](https://code.visualstudio.com/) (free)
- TouchDesigner: [Download here](https://derivative.ca/download) (free)
- For Mac users, download the driver available in the "01_Driver_Usb_Mac" folder.

**Setup:**

0. Install all the necessary software.
1. Upload the code by **marklysze** to your M5Stack. You can find the repository and instructions here: [GitHub Repository](https://github.com/marklysze/Magic-Pocket-Control-ESP32)
2. After uploading "m5stack-grey-touchdesigner" to your board, you can establish the initial Bluetooth connection with your Blackmagic camera.
3. Close Visual Studio and launch the TouchDesigner project (included in this repository).
4. In TouchDesigner, you need to establish the serial connection by identifying your port name and baud rate. Once connected, you'll be able to control your Black Magic camera using the 'CAMERA_CONTROL' UI.
5. To capture the video signal from your camera in TouchDesigner, you can use the Black Magic UltraStudio Recorder 3G.
6. Enjoy the functionalities!

Note: A video tutorial will be available as soon as possible.

Credits to **marklysze** for his significant assistance and excellent work on ESP32 connection and TouchDesigner adaptation!
