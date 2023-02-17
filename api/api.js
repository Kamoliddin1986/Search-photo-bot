const fs = require ('fs')

let read_file = (file_link) =>{
    return JSON.parse(fs.readFileSync(`./data/${file_link}`,'utf8'))
}

let write_to_file = (file_link,data) => {
    return fs.writeFileSync(`./data/${file_link}`,JSON.stringify(data, null, 4))
}

// let write_photo = ()

module.exports = {
    read_file,
    write_to_file
}