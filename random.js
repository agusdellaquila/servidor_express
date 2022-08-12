process.on('message', cant => {
    const rep = {}
    for (let i = 0; i < cant; i++) {
        const random = Math.floor(Math.random() * (999)  + 1)

        if (rep[random]) {
            rep[random]++
        } else {
            rep[random] = 1
        }

    }
    process.send(rep)
})