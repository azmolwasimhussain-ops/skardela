// This gives the player a file to save, for example the export of the saved data.
// It is in its own file, so a test can replace it: jsdom cannot download a file.
export function saveFile(fileName: string, text: string, type = "application/json"): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  // Some browsers start the download after the click event. Thus the URL stays for a short time.
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
