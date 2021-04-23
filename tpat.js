function print(x)
{
    console.log(x);
}

function printf(x, style)
{
    console.log(x, style);
}

function map(val, lb, ub, lv, uv)
{
    return lv + (val-lb)*(uv-lv)/(ub-lb);
}

function random(lv, uv)
{
    return map(Math.random(), 0, 1, lv, uv);
}

class TrianglePattern
{
    constructor(canvas_element, color_1, color_2, ox=0, oy=1) {
        this.canvas = canvas_element;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx = this.canvas.getContext("2d");
        this.W = this.canvas.width, this.H = this.canvas.height;

        this.color_1 = color_1;
        this.color_2 = color_2;
        this.ox = ox;
        this.oy = oy;

        this.divisions = 10;

        let stime = new Date().getTime();

        this.paint();

        printf(`Triangle Pattern rendered in: %c${new Date().getTime()-stime}ms`, "color: greenyellow;");
    }

    paint()
    {
        let h = this.H/2/this.divisions;
        let w = 2*h/Math.sqrt(3);

        // i goes from 0 to divisions
        // j goes from -1 to 2*this.W/w
        let max_d = 1.5*Math.hypot(Math.max(this.ox, 1-this.ox)*this.W, Math.max(this.oy, 1-this.oy)*this.W);
        max_d = 2000;
        
        for(let i = 0; i <= this.divisions; ++i)
        {
            for(let j = -1; j < 2*this.W/w; ++j)
            {
                this.ctx.strokeStyle = this.ctx.fillStyle = "rgb("+this.get_color_towards(this.color_1, this.color_2, map(Math.hypot(this.H/2-i*h, j*w/2), 0, max_d, 0, 1)+random(-0.05,0.05))+")";
                this.start();
                if((i+j)%2)
                {
                    this.moveTo(j*w/2+w/2, i*h);
                    this.lineTo(j*w/2, (i+1)*h);
                    this.lineTo(j*w/2+w, (i+1)*h);
                    
                    this.moveTo(j*w/2+w/2, this.H-i*h);
                    this.lineTo(j*w/2, this.H-(i+1)*h);
                    this.lineTo(j*w/2+w, this.H-(i+1)*h);
                }
                else
                {
                    this.moveTo(j*w/2+w/2, (i+1)*h);
                    this.lineTo(j*w/2, i*h);
                    this.lineTo(j*w/2+w, i*h);

                    this.moveTo(j*w/2+w/2, this.H-(i+1)*h);
                    this.lineTo(j*w/2, this.H-i*h);
                    this.lineTo(j*w/2+w, this.H-i*h);
                }
                this.stop();
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
    }
    
    get_color_towards(color_from, color_to, fraction)
    {
        return color_from.map((val, index)=>{
            return val + fraction*(color_to[index]-val);
        });
    }
    
    clamp_x_to_top_left(x, angle)
    {
        let dx = 0;
        if(x < 0)
        {
            dx = -x;
            x = 0;
        }
        else if(x > this.W)
        {
            dx = x-this.W;
            x = this.W;
        }
        let dy = dx*Math.tan(angle);
        return [x, dy]
    }
    
    moveTo(x, y)
    {
        this.ctx.moveTo(x, y);
    }
    
    lineTo(x, y)
    {
        this.ctx.lineTo(x, y);
    }
    
    handle_resize()
    {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.W = this.canvas.width, this.H = this.canvas.height;

        let stime = new Date().getTime();

        this.paint();

        printf(`Triangle Pattern resized and rendered in: %c${new Date().getTime()-stime}ms`, "color: greenyellow;");
    }
    
    stop()
    {
        this.ctx.closePath();
    }
    
    start()
    {
        this.ctx.beginPath();
    }
}