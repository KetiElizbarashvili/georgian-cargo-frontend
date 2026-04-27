export default function downloadBase64File(content, filename) {
  var a = document.createElement("a"); //Create <a>
  a.href = content; //Image Base64 Goes here
  a.download = filename + '.jpg'; //File name Here
  a.click(); //Downloaded file
}