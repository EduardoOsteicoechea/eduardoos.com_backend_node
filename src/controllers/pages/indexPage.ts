import {Request, Response} from 'express';

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Eduardo Osteicoechea</title>
</head>
<body>
    <h1>App running</h1>
</body>
</html>
`;

const htmlBuffer = Buffer.from(html, 'utf-8');
const bufferLength = htmlBuffer.length;

export const indexPage = (req: Request, res: Response) => {
   res.setHeader('Content-Type', 'text/html; charset=utf-8');
   res.setHeader('ContentLength', bufferLength);
   res.status(200).end(htmlBuffer);
}