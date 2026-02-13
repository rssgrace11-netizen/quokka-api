export let currentUser = null;
export let currentQuokka = null;

export const setState = (key, value) => {
    if (key === 'currentUser') currentUser = value;
    if (key === 'currentQuokka') currentQuokka = value;
};
