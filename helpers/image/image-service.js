const axios = require("axios");
const IMGBB_API_KEY = "10705e06a5fe1a6810e87ccdeff6eb5a";

class PhotoService {
  constructor(file) {
    this.file = file;
  }

  upload = async () => {
    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      {
        key: IMGBB_API_KEY,
        image: this.file?.buffer.toString("base64"),
      },
      { headers: { "content-type": "multipart/form-data" } }
    );

    if (response.data && response.data.data && response.data.data.display_url) {
      const profilePhotoLink = response.data.data.display_url;
      return profilePhotoLink;
    } else {
      console.error("Failed to upload photo. Response:", response.data);
      return null;
    }
  };
}

module.exports = PhotoService;
