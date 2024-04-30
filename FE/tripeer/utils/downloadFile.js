const toDataURL = async (url) => {
  return fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
};

const downloadFile = async (url, fileName) => {
  const a = document.createElement("a");
  a.href = await toDataURL(url);
  a.download = fileName || "download"; // fileName이 제공되지 않으면 "download" 사용

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export { toDataURL, downloadFile };
