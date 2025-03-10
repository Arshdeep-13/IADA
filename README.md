# IADA-PROJ

iada baddi portal features :-
1) 3 zones (industry, zonal admin, master admin)
2) login (jwt + captacha + otp)
3) alerts
4) services (water bill, chat system, maintaince bill, plot premium bill, otp service--> bulk messages)
5) payment gateway (icici bank --> ezpay) (mention the payment numbers)
6) gallery feature
7) pages(home, about us, help, services (after login)

Regarding water bill
1) master set --> percentages (gst, permanent connection, temporary connection, new water connection fee, Late Payment Surcharge, sewerage Fee, Bill Raising Date
2) zonal admin --> download sample excel and upload it with edited values.
3) industry pay the bill using ezpay PG.

Regarding chat system
1) we use api call instead of sockets (/save-user-chat, /unread-chat, /resolve-chat, /user-statisfied)
