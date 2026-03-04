export let currentUser = null;
export let currentQuokka = null;
export let quokkaList = [];
export let currentIdx = -1;

export const setState = (key, value) => {
    if (key === 'currentUser') currentUser = value;
    if (key === 'currentQuokka') currentQuokka = value;
    if (key === 'quokkaList') quokkaList = value;
    if (key === 'currentIdx') currentIdx = value;
};
