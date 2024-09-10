import { Adapter } from 'sst/auth' 
//import { AccountService } from "@dragonstart/core/models/account";
import { Hono } from 'hono'
import { hashPassword } from '@dragonstart/core/utils';
import { AdapterOptions } from 'sst/auth/adapter/adapter';
import { session } from './session';

export const EmailPassAdapter = (() => {
  return function (routes: Hono, ctx: AdapterOptions<any>) {
    routes.post('/authorize', async (c) => {

      const body = await c.req.json()

      if ( body.email && body.password) {

        const userRecord = await AccountService.entities.user.get({
          email: body.email
        }).go()
  
        if (!userRecord || !userRecord.data || userRecord.data.status !== 'active') {
          // TODO: tell the user that they are not authenticated.
          return new Response(JSON.stringify({ message: 'User does not exist'}), {
            status: 403,
            statusText: 'Not found'
          })
        }
  
        if (!userRecord.data.password) {
          return new Response(JSON.stringify({ message: 'User does not have a password'}), {
            status: 403,
            statusText: 'Not found'
          })
        }
  
        if (hashPassword(body.password) === userRecord.data.password) {
          
          let user = userRecord.data
          const assignedAccounts = await AccountService.collections
            .workspaces({ userId: user.userId })
            .go();

          const assignment = assignedAccounts.data.userAssignment[0];

          const token = await session.create({
            type: "user",
            properties: {
              userId: user.userId,
              email: user.email,
              name: user.name,
            },
          })
          
          return  new Response(JSON.stringify({
            token
          }), {
            status: 200
          })
        }
  
        return new Response(JSON.stringify({ message: 'User does not exist'}), {
          status: 403,
          statusText: 'Not found'
        })
      } else {
        new Response(JSON.stringify({ message: 'Missing email or password'}), {
          status: 400,
          statusText: 'Bad request'
        })
      }
    })    
  }
}) satisfies Adapter<{ claims: Record<string, string> }>;