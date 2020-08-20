const { create, decryptMedia } = require('@open-wa/wa-automate')
const fs = require('fs-extra')
const moment = require('moment')
const fetch = require('node-fetch')
const axios = require('axios')
const {artinama,
    quotes,
    weton,
    corona,
    alay,
    namaninjaku,
    liriklagu,
    quotemaker,
    yt,
    ytmp3,
    gd,
    jodoh,
    hilih,
    weather,
} = require('./lib/functions')
const quotedd = require('./lib/quote')
const insta = require('./lib/insta')
const videoUrlLink = require('video-url-link')
const kopit = require('./korona')
const fbvid = require('fbvideos');

const serverOption = {
    headless: true,
    qrRefreshS: 20,
    qrTimeout: 0,
    authTimeout: 0,
    autoRefresh: true,
    devtools: false,
    cacheEnabled:false,
    chromiumArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
}

const opsys = process.platform;
if (opsys == "win32" || opsys == "win64") {
serverOption['executablePath'] = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
} else if (opsys == "linux") {
serverOption['browserRevision'] = '737027';
} else if (opsys == "darwin") {
serverOption['executablePath'] = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

const startServer = async (from) => {
create('Imperial', serverOption)
        .then(client => {
            console.log('[SERVER] Server Started!')

            // Force it to keep the current session
            client.onStateChanged(state => {
                console.log('[State Changed]', state)
                if (state === 'CONFLICT') client.forceRefocus()
            })

            client.onMessage((message) => {
                msgHandler(client, message)
            })
        })
}

freedomurl = "https://i.ibb.co/6J9ST0d/IMG-20200731-WA0791.jpg"

async function msgHandler (client, message) {
    try {
        // console.log(message)
        const { type, body, from, t, sender, isGroupMsg, chat, groupMetadata, caption, isMedia, mimetype, quotedMsg } = message
        const { id, pushname } = sender
        const { name } = chat
	const names = sender.pushname || chat.name || sender.verifiedName || '';	
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const commands = ['#sticker', '#stiker', 'Stiker', 'P','p','support','Sticker','makasih','tq','Halo','Thank you','thx','#Stiker','#Sticker','stiker','sticker','Y','y','quotes','Quotes','Halo','info bot','corona','#korona','join','lirik','quotemaker','help',,'menu','Menu','#menu','owner','!meme','add','kick','leave','promote','demote','admin','linkgrup','tariklinkgrup','seasonal anime','neko','wallpaper','Heave ho','Heave ho!','quote','quotes','Cuaca hari ini','cuaca','#Tod','Pokemon','waifu','!Waifu','fbdl','ytmp3','igdl']
        const cmds = commands.map(x => x + '\\b').join('|')
        const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : type === 'image' && caption ? caption.match(new RegExp(cmds, 'gi')) : ''

        if (cmd) {
            if (!isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(names))
            if (isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(names), 'in', color(name))
            const args = body.trim().split(' ')
            switch (cmd[0]) {
                case '#sticker':
                case '#stiker':
                case 'sticker':
                case 'stiker':                   
                case 'Sticker':
                case 'Stiker':
                case '#Sticker':
                case '#Stiker':
                case 'P':
                case 'p':
                case 'Y':
                case 'y':
                    
                                    
                    
                    if (isMedia) {
                        const mediaData = await decryptMedia(message)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64, message)
                    } else if (quotedMsg && quotedMsg.type == 'image') {
                        const mediaData = await decryptMedia(quotedMsg)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64, message)
                    } else if (args.length == 2) {
                        var isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
                        const url = args[1]
                        if (url.match(isUrl)) {
                            await client.sendStickerfromUrl(from, url, { method: 'get' })
                                .catch(err => console.log('Caught exception: ', err))
                        } else {
                            client.sendText(from, ':v')
                        }
                    } else {
                        client.reply(from, `*${names}* Woi!,kalo mau buat stiker tinngal kirim gambarnya,pake caption "p"`, message)
                    }
                    break
                case 'Halo':
                        client.reply(from, `Halo *${names}*, Ada yang bisa saya bantu?`, message)
                    break
		case '#tod':
			client.sendImageAsStickerGif(from, 'https://i.imgur.com/31zUM5g.gif')
			client.sendStickerfromUrl(from, 'https://media.tenor.com/images/62c4b269d97c2412c4f364945f62afae/tenor.gif', {method: 'get'})			
                    break
		case 'covid':
        case 'corona':
        case '#korona':
			const result = await kopit()
			client.sendText(from, kopit())
		    break
		case 'ytmp3':
			if (args.length >=2){
                        	const url = args[1]
                        	const result = await ytmp3(url)
                        	client.sendFileFromUrl(from, result , 'audio.mp3')
			}else{
				client.reply(from, '*Cara Penggunaan*:\n\nytmp3 https://youtu.be/6l5V3BWDcMw', message)
}
                    break
		case 'igdl':
			await videoUrlLink.instagram.getInfo(args, async (error, info) => {
				if(error){
					client.reply(from, 'Keknya ada yang salah, coba lagi nanti', message)
					console.log(error)
				}else{
					const url = info.list[0].video ? info.list[0].video : info.list[0].image;
					await client.sendFileFromUrl(from, url)
				}
			})
		    break
		case 'lirik':
			if(args.length == 2){
                        	const lagu = args[1]
                        	const result = await liriklagu(lagu)
                        	client.sendText(from, result)
			}else{
				client.reply(from, '*Cara Penggunaan*:\n\nlirik aku-bukan-boneka\n"-" = adalah spasi', message)
}
                    break
		case 'Cuaca hari ini':
        case 'cuaca':
			if(args.length >= 2){
				const kota = args[1]
                        	const result = await weather(kota)
                        	client.sendText(from, result)
}
                    break
		case '#quotemaker':
        case 'quotemaker':            
                        if (args.length == 4) {
				client.sendText(from, 'Wait..') 
                        	const quotes = args[1]
                        	const author = args[2]
                        	const theme = args[3]
                        	const result = await quotemaker(quotes, author, theme)
                        	client.sendFile(from, result, 'quotesmaker.jpg','Done')
}
                    break
		case 'linkgrup':
			if(isGroupMsg){
				const inviteLink = await client.getGroupInviteLink(chat.id);
				client.sendLinkWithAutoPreview(from, inviteLink, `\nLink Grup *${name}*`)
}
		    break
		case 'owner':
			var owner = from.split('-')[0]
			client.sendText(from, `[${owner}]`)
		    break
		case 'add':
			if(isGroupMsg){
				if(args.length >=2){
					var wkwk = `${from.split('-')[0]}@c.us`
					if(message.author === wkwk ){
						org = args[1]
						client.addParticipant(from,`${org}@c.us`)
					}else{
						client.reply(from, 'Fitur ini hanya bisa di pakai oleh admin [owner]', message)
		}
	}
}
		    break
		case 'kick':
			if(isGroupMsg){
				if(args.length >=2){
					var wkwk = `${from.split('-')[0]}@c.us`
					if(message.author === wkwk ){
						wong = args[1]
						client.removeParticipant(from,`${wong}@c.us`)
					}else{
						client.reply(from, 'Fitur ini hanya bisa di pakai oleh admin [owner]', message)
		}
	}
}
		    break
	 case 'leave':
			if(isGroupMsg){
				client.sendText(from,'*Bye*')
				client.leaveGroup(from)
}
		    break
		case 'promote':
			if(isGroupMsg){
				if(args.length >=2){
					var wkwk = `${from.split('-')[0]}@c.us`
					if(message.author === wkwk ){
						prom = args[1]
						client.promoteParticipant(from,`${prom}@c.us`)
					}else{
						client.reply(from, 'Fitur ini hanya bisa di pakai oleh admin [owner]', message)
		}
	}
}
		    break
		case 'demote':
			if(isGroupMsg){
				if(args.length >=2){
					var wkwk = `${from.split('-')[0]}@c.us`
					if(message.author === wkwk ){
						demo = args[1]
						client.demoteParticipant(from,`${demo}@c.us`)
					}else{
						client.reply(from, 'Fitur ini hanya bisa di pakai oleh admin [owner]', message)
		}
	}
}
		    break
		case 'tariklinkgrup':
			if(isGroupMsg){
				client.revokeGroupInviteLink(chat.id);
				client.sendText(from, 'Tautan undangan berhasil di tarik')
}
		    break
		case 'join':
			if (args.length >=2) {
				const link = args[1]
				client.inviteInfo(link);
				client.joinGroupViaLink(link)
				client.sendText(from, '*Otewee mhankk*')
}
		    break
                    
                case 'Waifu':
                case '#waifu': 
                        q8 = q2 = Math.floor(Math.random() * 98) + 10;
                        client.sendFileFromUrl(from, 'http://randomwaifu.altervista.org/images/00'+q8+'.png', 'Waifu.png', 'Korewa daredesu ka?')
                    break
                case 'Heave ho':
                case 'Heave ho!':
                        client.sendFileFromUrl(from, 'https://i.ibb.co/KjJx5ps/Whats-App-Image-2020-08-01-at-16-36-10.jpg','Soran.jpg','*Soran Soran*')
                    break
                case '#neko':          
                        q2 = Math.floor(Math.random() * 900) + 300;
                        q3 = Math.floor(Math.random() * 900) + 300;
                        client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko ')
                    break
                 case 'Pokemon':
                        q7 = Math.floor(Math.random() * 890) + 1;
                        client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png',)
                    break
                case 'wallpaper' :
                       q4 = Math.floor(Math.random() * 800) + 100;
                       client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/anime-'+q4,'Anime.png','Here is your wallpaper')
                    break
                case '#quotes' :
		case 'quotes' :
		case 'Quotes' :
			client.sendText(from, quotedd())
		    break
		case '!meme':
			const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
			const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
			await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
		    break
                case 'fbdl':
                    if (args.length >=2) {
                        const urlvid = args[1]
                        const high = await fbvid.high(urlvid)
                        const low = await fbvid.low(urlvid)
                        if (high == "Either the video is deleted or it's not shared publicly!") {
                            client.sendFileFromUrl(from, low.url, "video.mp4", "SD Video successfully downloaded")
                        } else if (high !== "Either the video is deleted or it's not shared publicly!") {
                            client.sendFileFromUrl(from, high.url, "video.mp4", "HD Video successfully downloaded")
                        } else if (high == "Either the video is deleted or it's not shared publicly!" && low == "Either the video is deleted or it's not shared publicly!") {
                            client.reply(from,"The URL is invalid",message)
                        }
                    } else {
                        client.reply(from,"The format is fbdl [URL Video]",message)
                    }
                    break
		case '#help':
        case 'menu':
        case 'Menu':
        case '#menu':
                        client.sendText(from, `Hai *${names}*\n\n*Daftar Perintah*\n\n *p*\nMengubah gambar ke stiker\n*cuaca*\nMelihat cuaca hari ini \n*seasonal anime*\nMenampilkan daftar anime musiman\n*info bot* \nMenampilkan syarat dan ketentuan\n*quotes*\nMengirim quotes\n*corona*\nMelihat data corona di Indonesia\n*fbdl* spasi link\nMendownload video dari facebook\n*igdl* spasi link\nMendownload video dari instagram\n*support*\nUntuk mensupport agar server bot tetap hidup\n*linkgrup*\nMengambil tautan undangan grup, [ *bot admin* ]\n*tariklinkrup*\nMencabut tautan undangan saat ini, [ *bot admin* ]\n*join* spasi linkgrup\nUntuk menambahkan bot ke grup anda\n*lirik* aku-bukan-boneka\nMenampilkan lirik lagu aku bukan boneka\n*ytmp3* https://youtu.be/6l5V3BWDcMw\nMendownload mp3 dari YouTube\n [ *Owner Only* ]\n*add* 628xxxx\nUntuk menambahkan anggota grup\n*kick* 628xxx\nUntuk mengeluarkan member grup\n*promote* 628xxx\nMenaikkan member menjadi admin\n*demote* 628xxx\nMenurunkan admin menjadi member\n\n*Jika kalian mempunyai quotes,dan mau dimasukan ke database bot.Silahkan hubungi\nwa.me/6289636035164`)
                    break
		case 'seasonal anime':
                        client.sendText(from, 'Summer 2020 \n Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season \n Yahari Ore no Seishun Love Comedy wa Machigatteiru. Kan \n The God of High School \n Sword Art Online: Alicization - War of Underworld 2nd Season \n Enen no Shouboutai: Ni no Shou \n Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e \n Kanojo, Okarishimasu \n Deca-Dence \n Uzaki-chan wa Asobitai! \n Monster Musume no Oishasan')
		    break
                case 'Thank you':
                case 'thx':
                case 'makasih':
                case 'tq':   
                        client.sendText(from, '*Sama-sama*') 
                    break
                case 'support':
                    client.sendText(from, 'Untuk mensupport bot agar tetap hidup,silahkan hubungi \nwa.me/6289636035164 \n\nTerima Kasih')    
                case 'info bot':
                        client.sendText(from, 'Ini adalah program sumber terbuka yang ditulis dalam Javascript. \n \nDengan menggunakan bot, Anda menyetujui Syarat dan Ketentuan kami \n \nSyarat dan ketentuan \n \nTeks dan nama pengguna whatsapp Anda akan disimpan di server kami selama bot aktif, data Anda akan dihapus ketika  bot menjadi offline.  Kami TIDAK menyimpan gambar, video, file audio dan dokumen yang Anda kirim.\n \n Terima kasih, Selamat bersenang-senang! dan gunakan dengan bijak\n\n*Created by Dandi Project*')    
                     }
        } else {
            if (!isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
            if (isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

process.on('Something went wrong', function (err) {
    console.log('Caught exception: ', err);
  });

function color (text, color) {
  switch (color) {
    case 'red': return '\x1b[31m' + text + '\x1b[0m'
    case 'yellow': return '\x1b[33m' + text + '\x1b[0m'
    default: return '\x1b[32m' + text + '\x1b[0m' // default is green
  }
}

startServer()
