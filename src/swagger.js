import swaggerJSDoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },

  // 👇 VERY IMPORTANT (path must be correct)
  apis: [
    "./src/swagger/authSwagger.js",
    "./src/swagger/taskSwagger.js",
    "./src/swagger/inviteSwagger.js",
    "./src/swagger/teamSwagger.js",
    
  ]
}

const swaggerSpec = swaggerJSDoc(options)
export default swaggerSpec