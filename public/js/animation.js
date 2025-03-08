document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('ballCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to 80% of the window size
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    canvas.width = size;
    canvas.height = size;
    
    // Game state
    let isRunning = true;
    let currentMode = 'normal';
    let score = 0;
    let hasGravity = false;
    let speedMultiplier = 1;
    let sizeMultiplier = 1;
    
    // Wall drawing state
    let isDrawingWall = false;
    let isErasingWall = false;
    let wallStartX = 0;
    let wallStartY = 0;
    const walls = [];
    
    // Ball properties
    const ballCount = 1000;
    const balls = [];
    
    // Color palette for a cinematic look
    const colors = [
        '#FF3B30', '#FF9500', '#FFCC00', '#4CD964', 
        '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55',
        '#E6C229', '#F17105', '#D11149', '#6610F2',
        '#1A8FE3'
    ];
    
    // Lighting and shadow properties
    const lightSource = { x: canvas.width / 2, y: canvas.height / 2 };
    
    // Wall class
    class Wall {
        constructor(x1, y1, x2, y2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.color = 'rgba(255, 255, 255, 0.7)';
            this.width = 4;
        }
        
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.width;
            ctx.stroke();
        }
        
        // Check if a point is near this wall (for erasing)
        isNearPoint(x, y, threshold = 10) {
            // Calculate distance from point to line segment
            const A = x - this.x1;
            const B = y - this.y1;
            const C = this.x2 - this.x1;
            const D = this.y2 - this.y1;
            
            const dot = A * C + B * D;
            const lenSq = C * C + D * D;
            let param = -1;
            
            if (lenSq !== 0) param = dot / lenSq;
            
            let xx, yy;
            
            if (param < 0) {
                xx = this.x1;
                yy = this.y1;
            } else if (param > 1) {
                xx = this.x2;
                yy = this.y2;
            } else {
                xx = this.x1 + param * C;
                yy = this.y1 + param * D;
            }
            
            const dx = x - xx;
            const dy = y - yy;
            
            return Math.sqrt(dx * dx + dy * dy) < threshold;
        }
    }
    
    // Ball class
    class Ball {
        constructor() {
            this.baseRadius = Math.random() * 5 + 2;
            this.radius = this.baseRadius * sizeMultiplier;
            this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
            this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
            this.vx = ((Math.random() - 0.5) * 2) * speedMultiplier;
            this.vy = ((Math.random() - 0.5) * 2) * speedMultiplier;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.5;
            this.mass = this.radius;
            this.isExploding = false;
            this.explosionTime = 0;
            this.explosionDuration = 30;
            this.originalColor = this.color;
        }
        
        draw() {
            // Handle explosion effect
            if (this.isExploding) {
                this.explosionTime++;
                if (this.explosionTime > this.explosionDuration) {
                    this.isExploding = false;
                    this.explosionTime = 0;
                    this.color = this.originalColor;
                } else {
                    // Pulse effect during explosion
                    const pulseScale = 1 + Math.sin(this.explosionTime / 2) * 0.3;
                    this.radius = this.baseRadius * sizeMultiplier * pulseScale;
                    this.color = '#FFFFFF';
                }
            } else {
                this.radius = this.baseRadius * sizeMultiplier;
            }
            
            // Calculate distance from light source for shadow effect
            const dx = this.x - lightSource.x;
            const dy = this.y - lightSource.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const normalizedDistance = Math.min(distance / (canvas.width / 2), 1);
            
            // Create gradient for 3D effect
            const gradient = ctx.createRadialGradient(
                this.x - this.radius * 0.3, 
                this.y - this.radius * 0.3,
                0,
                this.x,
                this.y,
                this.radius * 2
            );
            
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
            
            // Draw ball with shadow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Add highlight
            ctx.beginPath();
            ctx.arc(
                this.x - this.radius * 0.3,
                this.y - this.radius * 0.3,
                this.radius * 0.3,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();
        }
        
        update() {
            if (!isRunning) return;
            
            // Apply gravity if enabled
            if (hasGravity) {
                this.vy += 0.05;
            }
            
            // Apply speed multiplier
            const actualVx = this.vx * speedMultiplier;
            const actualVy = this.vy * speedMultiplier;
            
            // Move the ball
            this.x += actualVx;
            this.y += actualVy;
            
            // Bounce off walls
            if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
                this.vx = -this.vx;
                if (this.x - this.radius < 0) {
                    this.x = this.radius;
                } else {
                    this.x = canvas.width - this.radius;
                }
                this.increaseScore(1);
            }
            
            if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
                this.vy = -this.vy;
                if (this.y - this.radius < 0) {
                    this.y = this.radius;
                } else {
                    this.y = canvas.height - this.radius;
                }
                this.increaseScore(1);
            }
            
            // Check collision with user-drawn walls
            this.checkWallCollisions();
        }
        
        checkWallCollisions() {
            for (const wall of walls) {
                // Line segment collision detection with circle
                const x1 = wall.x1;
                const y1 = wall.y1;
                const x2 = wall.x2;
                const y2 = wall.y2;
                
                // Vector from wall start to end
                const wallVectorX = x2 - x1;
                const wallVectorY = y2 - y1;
                const wallLength = Math.sqrt(wallVectorX * wallVectorX + wallVectorY * wallVectorY);
                
                // Normalized wall vector
                const wallNormalX = wallVectorX / wallLength;
                const wallNormalY = wallVectorY / wallLength;
                
                // Vector from wall start to ball
                const ballVectorX = this.x - x1;
                const ballVectorY = this.y - y1;
                
                // Project ball vector onto wall vector
                const projection = ballVectorX * wallNormalX + ballVectorY * wallNormalY;
                
                // Closest point on wall to ball
                let closestX, closestY;
                
                if (projection < 0) {
                    closestX = x1;
                    closestY = y1;
                } else if (projection > wallLength) {
                    closestX = x2;
                    closestY = y2;
                } else {
                    closestX = x1 + wallNormalX * projection;
                    closestY = y1 + wallNormalY * projection;
                }
                
                // Distance from ball to closest point
                const distanceX = this.x - closestX;
                const distanceY = this.y - closestY;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                
                // Check if ball is colliding with wall
                if (distance < this.radius) {
                    // Reflect velocity vector across wall normal
                    const wallPerpendicularX = -wallNormalY;
                    const wallPerpendicularY = wallNormalX;
                    
                    // Calculate dot product of velocity and wall perpendicular
                    const dotProduct = this.vx * wallPerpendicularX + this.vy * wallPerpendicularY;
                    
                    // Reflect velocity
                    this.vx = this.vx - 2 * dotProduct * wallPerpendicularX;
                    this.vy = this.vy - 2 * dotProduct * wallPerpendicularY;
                    
                    // Move ball outside of wall
                    const overlap = this.radius - distance;
                    const moveX = (distanceX / distance) * overlap;
                    const moveY = (distanceY / distance) * overlap;
                    this.x += moveX;
                    this.y += moveY;
                    
                    this.increaseScore(5);
                    
                    // Slight random variation to make bounces more interesting
                    this.vx += (Math.random() - 0.5) * 0.2;
                    this.vy += (Math.random() - 0.5) * 0.2;
                }
            }
        }
        
        checkCollision(otherBall) {
            if (!isRunning) return;
            
            const dx = this.x - otherBall.x;
            const dy = this.y - otherBall.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.radius + otherBall.radius) {
                // Calculate collision response
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);
                
                // Rotate velocity vectors
                const vx1 = this.vx * cos + this.vy * sin;
                const vy1 = this.vy * cos - this.vx * sin;
                const vx2 = otherBall.vx * cos + otherBall.vy * sin;
                const vy2 = otherBall.vy * cos - otherBall.vx * sin;
                
                // Final velocities after collision (elastic collision)
                const finalVx1 = ((this.mass - otherBall.mass) * vx1 + 2 * otherBall.mass * vx2) / (this.mass + otherBall.mass);
                const finalVx2 = ((otherBall.mass - this.mass) * vx2 + 2 * this.mass * vx1) / (this.mass + otherBall.mass);
                
                // Update velocities
                this.vx = finalVx1 * cos - vy1 * sin;
                this.vy = vy1 * cos + finalVx1 * sin;
                otherBall.vx = finalVx2 * cos - vy2 * sin;
                otherBall.vy = vy2 * cos + finalVx2 * sin;
                
                // Move balls apart to prevent sticking
                const overlap = (this.radius + otherBall.radius) - distance;
                const moveX = overlap * cos / 2;
                const moveY = overlap * sin / 2;
                
                this.x += moveX;
                this.y += moveY;
                otherBall.x -= moveX;
                otherBall.y -= moveY;
                
                this.increaseScore(2);
                
                // If one ball is exploding, make the other explode too
                if (this.isExploding) {
                    otherBall.isExploding = true;
                    otherBall.explosionTime = 0;
                } else if (otherBall.isExploding) {
                    this.isExploding = true;
                    this.explosionTime = 0;
                }
            }
        }
        
        increaseScore(points) {
            score += points;
            document.getElementById('score').textContent = score;
        }
        
        explode() {
            this.isExploding = true;
            this.explosionTime = 0;
            
            // Add explosion force
            const explosionForce = 5;
            const dx = this.x - canvas.width / 2;
            const dy = this.y - canvas.height / 2;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                this.vx += (dx / distance) * explosionForce;
                this.vy += (dy / distance) * explosionForce;
            } else {
                // Random direction if at center
                const angle = Math.random() * Math.PI * 2;
                this.vx += Math.cos(angle) * explosionForce;
                this.vy += Math.sin(angle) * explosionForce;
            }
        }
    }
    
    // Initialize balls
    for (let i = 0; i < ballCount; i++) {
        balls.push(new Ball());
    }
    
    // Optimization: Use spatial partitioning for collision detection
    function createGrid() {
        const cellSize = 10; // Size of each grid cell
        const gridWidth = Math.ceil(canvas.width / cellSize);
        const gridHeight = Math.ceil(canvas.height / cellSize);
        const grid = new Array(gridWidth * gridHeight).fill().map(() => []);
        
        // Place balls in grid cells
        balls.forEach(ball => {
            const cellX = Math.floor(ball.x / cellSize);
            const cellY = Math.floor(ball.y / cellSize);
            
            if (cellX >= 0 && cellX < gridWidth && cellY >= 0 && cellY < gridHeight) {
                const index = cellY * gridWidth + cellX;
                if (grid[index]) {
                    grid[index].push(ball);
                }
            }
        });
        
        return { grid, cellSize, gridWidth };
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with slight transparency for motion blur effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw container
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Draw walls
        walls.forEach(wall => wall.draw());
        
        // Update and draw balls
        const { grid, cellSize, gridWidth } = createGrid();
        
        balls.forEach(ball => {
            ball.update();
            
            // Check collisions only with nearby balls using grid
            const cellX = Math.floor(ball.x / cellSize);
            const cellY = Math.floor(ball.y / cellSize);
            
            if (cellX >= 0 && cellX < gridWidth && cellY >= 0 && cellY < Math.ceil(canvas.height / cellSize)) {
                // Check neighboring cells
                for (let y = Math.max(0, cellY - 1); y <= Math.min(Math.floor(canvas.height / cellSize) - 1, cellY + 1); y++) {
                    for (let x = Math.max(0, cellX - 1); x <= Math.min(Math.floor(canvas.width / cellSize) - 1, cellX + 1); x++) {
                        const index = y * gridWidth + x;
                        
                        if (grid[index]) {
                            grid[index].forEach(otherBall => {
                                if (ball !== otherBall) {
                                    ball.checkCollision(otherBall);
                                }
                            });
                        }
                    }
                }
            }
            
            ball.draw();
        });
        
        // Slowly move light source for dynamic shadows
        lightSource.x = canvas.width / 2 + Math.sin(Date.now() / 5000) * canvas.width / 4;
        lightSource.y = canvas.height / 2 + Math.cos(Date.now() / 7000) * canvas.height / 4;
        
        // Draw temporary wall while user is drawing
        if (isDrawingWall && wallStartX !== null) {
            ctx.beginPath();
            ctx.moveTo(wallStartX, wallStartY);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 4;
            ctx.stroke();
        }
        
        // Update wall count display
        document.getElementById('wallCount').textContent = walls.length;
        
        requestAnimationFrame(animate);
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        // Erase walls if in erase mode
        if (isErasingWall) {
            for (let i = walls.length - 1; i >= 0; i--) {
                if (walls[i].isNearPoint(mouseX, mouseY)) {
                    walls.splice(i, 1);
                }
            }
        }
    });
    
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        if (isDrawingWall) {
            wallStartX = mouseX;
            wallStartY = mouseY;
        }
    });
    
    canvas.addEventListener('mouseup', (e) => {
        if (isDrawingWall && wallStartX !== null) {
            const rect = canvas.getBoundingClientRect();
            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;
            
            // Only add wall if it has some length
            const dx = endX - wallStartX;
            const dy = endY - wallStartY;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            if (length > 10) {
                walls.push(new Wall(wallStartX, wallStartY, endX, endY));
            }
            
            wallStartX = null;
            wallStartY = null;
        }
    });
    
    // Button event listeners
    document.getElementById('addWallBtn').addEventListener('click', () => {
        isDrawingWall = !isDrawingWall;
        isErasingWall = false;
        updateModeDisplay();
        toggleButtonActive('addWallBtn', isDrawingWall);
        toggleButtonActive('eraseWallBtn', false);
    });
    
    document.getElementById('eraseWallBtn').addEventListener('click', () => {
        isErasingWall = !isErasingWall;
        isDrawingWall = false;
        updateModeDisplay();
        toggleButtonActive('eraseWallBtn', isErasingWall);
        toggleButtonActive('addWallBtn', false);
    });
    
    document.getElementById('clearWallsBtn').addEventListener('click', () => {
        walls.length = 0;
    });
    
    document.getElementById('explosionBtn').addEventListener('click', () => {
        // Create explosion effect
        balls.forEach(ball => {
            ball.explode();
        });
    });
    
    document.getElementById('gravityBtn').addEventListener('click', () => {
        hasGravity = !hasGravity;
        updateModeDisplay();
        toggleButtonActive('gravityBtn', hasGravity);
    });
    
    document.getElementById('freezeBtn').addEventListener('click', () => {
        isRunning = !isRunning;
        updateModeDisplay();
        toggleButtonActive('freezeBtn', !isRunning);
    });
    
    // Slider event listeners
    document.getElementById('speedSlider').addEventListener('input', (e) => {
        speedMultiplier = parseFloat(e.target.value);
    });
    
    document.getElementById('sizeSlider').addEventListener('input', (e) => {
        sizeMultiplier = parseFloat(e.target.value);
    });
    
    // Helper functions
    function toggleButtonActive(id, isActive) {
        const button = document.getElementById(id);
        if (isActive) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }
    
    function updateModeDisplay() {
        let mode = 'Normal';
        if (isDrawingWall) mode = 'Drawing Walls';
        if (isErasingWall) mode = 'Erasing Walls';
        if (!isRunning) mode = 'Paused';
        if (hasGravity) mode += ' + Gravity';
        
        document.getElementById('currentMode').textContent = mode;
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
        canvas.width = size;
        canvas.height = size;
    });
    
    // Start animation
    animate();
}); // Adding a comment to demonstrate Git workflow
