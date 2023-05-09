type stateChangeHookFunc = (arg: string) => void
export interface CmdHandlerDeps {
  setLogs: stateChangeHookFunc
}
export interface ICommand {
  cmd: string
  args: string[]
  err: string
}
export interface ICmdParserInput {
  user_input: string[]
}
export interface ICmdHandlerInput {
  cmd: string
  args: string[]
}
export interface ICmdHandlerOutput {
  err: string
  msg: string
}

export interface IMinArgsInput {
  args: string[]
  minArgs: number
}
