import re
import time
import json
import asyncio
import websockets
import logging
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

# Load the model and tokenizer
model_path = 'gaussalgo/T5-LM-Large-text2sql-spider'
model = AutoModelForSeq2SeqLM.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)


# Table names and column names
table_names = []  # Table name in the schema
column_names = []  # Column names in the schema

# Function to add double quotations to table and column names in the SQL query
def add_double_quotations(sql_query, table_names, column_names):
    """
    Add double quotations to table and column names in the SQL query.
    :param sql_query: Input SQL query string
    :param table_names: List of table names
    :param column_names: List of column names
    :return: Formatted SQL query
    """
    # Create a mapping for tables and columns
    table_map = {table.lower(): f'public."{table}"' for table in table_names}
    column_map = {col.lower(): f'"{col}"' for col in column_names}

    # Define a regex pattern to identify table and column names
    identifier_pattern = r'\b\w+\b'

    # Replace table and column names using the maps
    def replace_identifiers(match):
        identifier = match.group(0)
        if identifier.lower() in table_map:
            return table_map[identifier.lower()]
        elif identifier.lower() in column_map:
            return column_map[identifier.lower()]
        return identifier  # Return the original if not found

    # Apply the regex pattern to the SQL query
    formatted_query = re.sub(identifier_pattern, replace_identifiers, sql_query)
    return formatted_query

# Function to generate SQL query from the question using the transformer model
def generate_sql_query(question, table_names, column_names):
    # Combine question with schema
    input_text = " ".join(["Question: ", question, "Schema:", schema])

    try:
        # Start the timer
        start_time = time.time()

        # Tokenize the input and generate the output
        model_inputs = tokenizer(input_text, return_tensors="pt")
        outputs = model.generate(**model_inputs, max_length=512)

        # Stop the timer
        end_time = time.time()

        # Decode and return the SQL query
        output_text = tokenizer.batch_decode(outputs, skip_special_tokens=True)
        generated_sql = output_text[0]

        # Add double quotations to table and column names
        formatted_sql = add_double_quotations(generated_sql, table_names, column_names)

        # Print the time taken (for logging)
        print(f"Time taken: {end_time - start_time:.2f} seconds\n")
        return formatted_sql
    except Exception as e:
        return f"An error occurred: {e}"

# Set up logging
logging.basicConfig(level=logging.INFO)



#WebSocket handler that processes questions and returns SQL
# async def echo(websocket):
#     logging.info(f"New connection from {websocket.remote_address}")
#     try:
#         async for message in websocket:
#             logging.info(f"Received message: {message}")
#             # Call the function to generate SQL query from the question
#             sql_query = generate_sql_query(message)
#             await websocket.send(sql_query)
#     except websockets.exceptions.ConnectionClosed as e:
#         logging.error(f"Connection closed: {e}")

# WebSocket handler that processes questions and returns SQL
async def echo(websocket):
    logging.info(f"New connection from {websocket.remote_address}")
    try:
        async for message in websocket:
            logging.info(f"Received message: {message}")

            # Parse the received JSON
            data = json.loads(message)
            table_name = data.get("tableName", "")
            columns = data.get("columns", [])
            primary_key = data.get("primaryKey", "")
            foreign_keys = data.get("foreignKeys", [])
            query = data.get("query", "")

            # Format the schema exactly as expected
            schema = f'"""\n"{table_name}"\n'
            for col in columns:
                schema += f'  "{col["name"]}" {col["type"]},\n'
            schema += f'  foreign_key: {", ".join(fk for fk in foreign_keys) if foreign_keys else ""}\n'
            schema += f'  primary key: "{primary_key}"\n"""'

            # Create a single variable to send
            formatted_input = f"{schema}\n\n{query}"

            # Generate SQL query with only one argument
            sql_query = generate_sql_query(formatted_input)

            # Send the SQL query back to the client
            await websocket.send(sql_query)

    except websockets.exceptions.ConnectionClosed as e:
        logging.error(f"Connection closed: {e}")


# WebSocket server function
async def main():
    # Create the WebSocket server
    server = await websockets.serve(echo, "0.0.0.0", 8765)
    logging.info("WebSocket Server running on ws://0.0.0.0:8765")

    # Keep the server running indefinitely
    await server.wait_closed()

if __name__ == "__main__":
    # Run the WebSocket server
    asyncio.run(main())
