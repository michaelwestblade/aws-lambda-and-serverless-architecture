# aws-lambda-and-serverless-architecture

aws s3 cp resizeImages.zip s3://westblade-images/resizeImages.zip

aws lambda update-function-code --function-name resizeImages --s3-bucket westblade-images --s3-key resizeImages.zip --publish

