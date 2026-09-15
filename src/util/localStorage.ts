
class storage {

    static set(key:any, cartItems:any) {
        localStorage.setItem(key, JSON.stringify(cartItems))
    }

    static get(key: string) {
        const value = localStorage.getItem(key);

        return value ? JSON.parse(value) : null;
    }
}

export default storage