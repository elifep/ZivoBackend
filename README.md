# Zivo API

Zivo mobil uygulamasının sunucusu. Salon, hizmet, çalışan, randevu, yorum ve favori verisini PostgreSQL’de tutar. İstemci bu API’ye `5000` portundan bağlanır.

## Ne yapar

İki rol vardır: `user` (müşteri) ve `business` (işletme). Şifreler bcrypt ile saklanır. Girişten sonra istekler `Authorization: Bearer` jetonu ile gider.

- Kayıt, giriş ve jeton yenileme
- Salon listeleme, arama, yakındakiler, oluşturma ve fotoğraf yükleme
- Hizmet, çalışan ve çalışma saati
- Randevu oluşturma, işletmeye göre listeleme ve durum güncelleme
- Yorum ve ortalama puan
- Favori salonlar
- Profil
- Şikayet kayıtları ve salon sosyal medya bağlantıları

Salon ve profil fotoğrafları S3’e yüklenir.

## Çalıştırma

```bash
npm install
npm run dev
```

Geliştirme komutu `ts-node-dev` ile `src/app.ts` dosyasını izler. Derlenmiş hali için `npm run build`, ardından `npm start`.

Sunucu `PORT` yoksa `5000` portunu açar. Android emülatöründeki uygulama bu porta `http://10.0.2.2:5000` ile ulaşır.

## Ortam

Proje kökünde `.env` dosyası gerekir. Bu dosya depoya konmaz.

```text
PORT=5000
DATABASE_URL=postgresql://kullanici:sifre@sunucu:5432/zivo
JWT_SECRET=uzun-bir-gizli-anahtar
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
```

`DATABASE_URL` bir PostgreSQL bağlantı cümlesidir. Bağlantı, barındırılan veritabanları için SSL kullanır.

## Veritabanı

Şema `migrations/` altındadır. Sıra kullanıcıdan randevu ve yoruma kadar `001`–`011` dosyalarıdır. Boş bir veritabanına uygulamak için:

```bash
npx ts-node src/utils/runMigrations.ts
```

## Kimlik

`POST /auth/register` gövdesi `email`, `password` ve isteğe bağlı `role` alır. Rol verilmezse `user` olur.

`POST /auth/login` gövdesi `email` ve `password` alır. Yanıtta `accessToken` (55 dakika), `refreshToken` (7 gün) ve kullanıcı bilgisi döner.

`POST /auth/refresh` gövdesi `{ "token": "<refreshToken>" }` bekler.

Jeton gereken uçlarda rol uymazsa yanıt `403` olur.

## Uçlar

| Yol | Kim kullanır |
| --- | --- |
| `GET /businesses`, `/nearby`, `/search`, `/top-rated`, `/most-booked`, `/:id` | Herkes |
| `POST /businesses`, `PUT /businesses/:id`, `DELETE /businesses/:id` | İşletme. Fotoğraf alanı `image` |
| `GET /services`, `GET /services/business/:businessId` | Herkes |
| `POST /services`, `PUT /services/:id`, `DELETE /services/:id` | İşletme |
| `GET /staff/business/:businessId` | Herkes |
| `POST /staff`, `PUT /staff/:id`, `DELETE /staff/:id` | İşletme |
| `GET /working_hours/:businessId` | Herkes |
| `POST /working_hours`, `PUT /working_hours/:id`, `DELETE /working_hours/:id` | İşletme |
| `GET /appointments/user` | Müşteri, kendi randevuları |
| `GET /appointments/business/:businessId` | İşletme |
| `POST /appointments` | Müşteri. Gövde: `businessId`, `servicesId`, `staffId`, `appointment_time` |
| `PUT /appointments/:id/status` | Müşteri veya işletme |
| `DELETE /appointments/:id` | Müşteri |
| `GET /reviews/business/:businessId`, `/business/:businessId/average` | Herkes |
| `POST /reviews`, `PUT /reviews/:id`, `DELETE /reviews/:id` | Müşteri |
| `GET /favourites`, `POST /favourites`, `DELETE /favourites/:businessId` | Müşteri |
| `GET /profiles/me`, `PUT /profiles/me` | Müşteri. Fotoğraf alanı `image` |
| `GET/POST /social_media`, `GET/POST /reports` | İlgili listeleme ve kayıt uçları |

Tarayıcıdan gelen isteklerde izin verilen adresler `http://localhost:3000`, `https://zivoapp.com` ve `https://admin.zivoapp.com` adresleridir. Mobil uygulama origin göndermez; bu istekler kabul edilir.

## Klasörler

```text
src/routes        HTTP yolları
src/controllers   İstek ve yanıt
src/services      Veritabanı sorguları
src/middleware    Jeton kontrolü ve dosya yükleme
migrations        SQL şema
```

## Teknolojiler

Node.js, Express, TypeScript, PostgreSQL (`pg`), JWT, bcrypt, AWS S3.
