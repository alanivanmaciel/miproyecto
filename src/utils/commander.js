import { Command } from 'commander'

const program = new Command()

program
    .option('--mode <mode>', 'Especificacion de entorno.', 'production')
    .parse()

export default program