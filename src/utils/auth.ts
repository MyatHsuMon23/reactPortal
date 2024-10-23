export const setCookies = (data: any, expirationDate: string) => {
  // // set data to cookie
  // let expires = "";
  // let day = 1;
  // let date = new Date();
  // date.setTime(date.getTime() + (day * 24 * 60 * 60 * 1000));
  // expires = "; expires=" + date.toUTCString();

  // document.cookie = "accessToken=" + (data.toString() || "") + expires + "; path=/";

  document.cookie = `accessToken=${data.toString() || ""}; expires=${expirationDate}; path=/; SameSite=Lax`;
}

export const getCookies = (name: any) => {
  // get data from cookie
  let nameEQ = name + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export const setAccessToken = (data: any, expirationDate: string) => {
  // for encrypted
  // let cipherText = AES.encrypt(JSON.stringify(data), 'access_token_info');
  // localStorage.setItem("access_token", cipherText.toString());

  // for non encrypted
  // localStorage.setItem("access_token", data.toString());

  const tokenData = {
    token: data.toString() || "",
    expiresAt: expirationDate,
  };
  localStorage.setItem('accessToken', JSON.stringify(tokenData));
}

export const getAccessToken = () => {
  // for encrypted
  // let sessi = localStorage.getItem('access_token');
  // if (!sessi) return false
  // let bytes = AES.decrypt(sessi, 'access_token_info');
  // let decryptedData = JSON.parse(bytes.toString(enc.Utf8));
  // return decryptedData

  // for non encrypted
  // let sessi = localStorage.getItem('access_token');
  // return sessi

  const tokenData = localStorage.getItem('accessToken');
  if (tokenData) {
    const { token, expiresAt } = JSON.parse(tokenData);
    // Check if the token has expired
    if (expiresAt && Date.now() > new Date(expiresAt).getTime()) {
      removeToken();
      return null;
    }
    return token;
  }
  return null;
}

export const removeToken = () => {
  localStorage.removeItem('accessToken');
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export const cleanStorage = () => {
  localStorage.clear();
  // localStorage.removeItem('accessToken');
  // document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
export const setItemToStroage = (key: string, value: string) => {
  localStorage.setItem(key, value);
}
export const getItemFromStorage = (key: string) => {
  if (localStorage.getItem(key) != null && localStorage.getItem(key) != undefined)
    return JSON.parse(localStorage.getItem(key) || "{}");
  else
    return null;
}